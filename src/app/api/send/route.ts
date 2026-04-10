import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { images } from "@/db/schema";
import { sendTrackedImageEmail } from "@/lib/email";

const sendSchema = z.object({
  imageId: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const image = db
    .select()
    .from(images)
    .where(and(eq(images.id, parsed.data.imageId), eq(images.userId, userId)))
    .get();

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100";
  const trackedImageUrl = `${base}/t/${image.slug}`;
  const pixelUrl = `${base}/t/${image.slug}?pixel=1`;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Email is not configured. Set RESEND_API_KEY in .env.local to enable sending.",
      },
      { status: 503 },
    );
  }

  try {
    await sendTrackedImageEmail({
      to: parsed.data.to,
      subject: parsed.data.subject,
      body: parsed.data.body,
      trackedImageUrl,
      pixelUrl,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to send" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
