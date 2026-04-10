import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { images } from "@/db/schema";
import { readImage } from "@/lib/storage";
import { recordEvent, getClientIp } from "@/lib/tracking";

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

  const image = db.select().from(images).where(eq(images.slug, slug)).get();

  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Log the event
  recordEvent({
    imageId: image.id,
    ip: getClientIp(req),
    userAgent: req.headers.get("user-agent"),
    referer: req.headers.get("referer"),
  });

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
