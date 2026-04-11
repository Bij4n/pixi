import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { images } from "@/db/schema";
import { deleteImage } from "@/lib/storage";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const image = db
    .select()
    .from(images)
    .where(and(eq(images.id, id), eq(images.userId, userId)))
    .get();

  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Remove the file from disk
  await deleteImage(image.storagePath);

  // Remove DB row (events cascade via FK)
  db.delete(images).where(eq(images.id, id)).run();

  return NextResponse.json({ ok: true });
}
