import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { images } from "@/db/schema";
import { saveImage } from "@/lib/storage";
import { generateSlug } from "@/lib/tracking";
import { signImageBuffer } from "@/lib/c2pa";
import { rateLimit } from "@/lib/rate-limit";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 10 uploads per user per minute (token bucket)
  const limit = rateLimit(`upload:${userId}`, {
    capacity: 10,
    refillRate: 10 / 60,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Try again in a moment." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported image type" },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 10MB)" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = nanoid();
  const slug = generateSlug();
  const extension = file.name.split(".").pop() ?? "bin";

  // Try to C2PA-sign the image. If signing fails, proceed with unsigned.
  let finalBuffer = buffer;
  let signed = false;
  try {
    const result = await signImageBuffer(buffer, file.type);
    finalBuffer = result.buffer;
    signed = result.signed;
  } catch {
    // signing failed; store unsigned
  }

  const storagePath = await saveImage(finalBuffer, id, extension);

  db.insert(images)
    .values({
      id,
      userId,
      slug,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: finalBuffer.byteLength,
      storagePath,
      c2paSigned: signed,
    })
    .run();

  return NextResponse.json({ id, slug }, { status: 201 });
}
