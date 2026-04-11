import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { images } from "@/db/schema";
import { readImage } from "@/lib/storage";
import { recordEvent, getClientIp } from "@/lib/tracking";
import { rateLimit } from "@/lib/rate-limit";

// 1x1 transparent GIF bytes for ?pixel=1 mode
const PIXEL_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ip = getClientIp(req) ?? "unknown";

  // Rate limit: 60 hits per IP per minute. Protects against abusive
  // scrapers inflating view counts. Exceeds return the pixel silently
  // without logging an event.
  const limit = rateLimit(`track:${ip}:${slug}`, {
    capacity: 60,
    refillRate: 1,
  });

  const image = db.select().from(images).where(eq(images.slug, slug)).get();

  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Only log the event if within rate limit
  if (limit.allowed) {
    recordEvent({
      imageId: image.id,
      ip,
      userAgent: req.headers.get("user-agent"),
      referer: req.headers.get("referer"),
    });
  }

  const url = new URL(req.url);
  const pixelMode = url.searchParams.get("pixel") === "1";

  if (pixelMode) {
    return new NextResponse(new Uint8Array(PIXEL_GIF), {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Length": String(PIXEL_GIF.length),
      },
    });
  }

  try {
    const buffer = await readImage(image.storagePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Length": String(buffer.length),
      },
    });
  } catch {
    return new NextResponse("Image file missing", { status: 500 });
  }
}
