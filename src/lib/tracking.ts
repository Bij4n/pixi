import { customAlphabet } from "nanoid";
import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { events } from "@/db/schema";

// URL-safe, no lookalikes
const slugGenerator = customAlphabet("abcdefghjkmnpqrstuvwxyz23456789", 10);

export function generateSlug(): string {
  return slugGenerator();
}

export function recordEvent({
  imageId,
  ip,
  userAgent,
  referer,
}: {
  imageId: string;
  ip?: string | null;
  userAgent?: string | null;
  referer?: string | null;
}) {
  db.insert(events)
    .values({
      id: nanoid(),
      imageId,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
      referer: referer ?? null,
    })
    .run();
}

export function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return null;
}
