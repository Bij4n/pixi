import { and, eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { images, events } from "@/db/schema";
import { toCsv } from "@/lib/csv";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const image = db
    .select()
    .from(images)
    .where(and(eq(images.id, id), eq(images.userId, userId)))
    .get();

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  const rows = db
    .select()
    .from(events)
    .where(eq(events.imageId, id))
    .orderBy(desc(events.createdAt))
    .all();

  const csv = toCsv(
    rows.map((e) => ({
      timestamp: new Date(e.createdAt).toISOString(),
      ip: e.ip ?? "",
      user_agent: e.userAgent ?? "",
    })),
    ["timestamp", "ip", "user_agent"],
  );

  const safeName = image.filename.replace(/[^a-z0-9._-]+/gi, "_");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${safeName}-events.csv"`,
    },
  });
}
