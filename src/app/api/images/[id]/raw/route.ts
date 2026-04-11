import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { images } from "@/db/schema";
import { readImage } from "@/lib/storage";

// Serves the raw image bytes for authenticated owners only.
// Does NOT log a tracking event — that's what /t/:slug is for.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const image = db
    .select()
    .from(images)
    .where(and(eq(images.id, id), eq(images.userId, userId)))
    .get();

  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer = await readImage(image.storagePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return new NextResponse("File missing", { status: 500 });
  }
}
