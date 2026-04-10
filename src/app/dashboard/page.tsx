import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { images, events } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/login");

  const rows = db
    .select({
      id: images.id,
      slug: images.slug,
      filename: images.filename,
      createdAt: images.createdAt,
      signed: images.c2paSigned,
      viewCount: sql<number>`(SELECT COUNT(*) FROM ${events} WHERE ${events.imageId} = ${images.id})`,
    })
    .from(images)
    .where(eq(images.userId, userId))
    .orderBy(desc(images.createdAt))
    .all();

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          No images yet
        </p>
        <h1 className="mt-4 text-2xl font-medium tracking-tight">
          Upload your first image to start tracking.
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          We&apos;ll embed an invisible tracking pixel and sign it with C2PA
          credentials. Share the tracked link anywhere.
        </p>
        <Link
          href="/dashboard/upload"
          className="mt-8 rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition hover:opacity-85"
        >
          Upload an image
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-medium tracking-tight">Your images</h1>
        <Link
          href="/dashboard/upload"
          className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:opacity-85"
        >
          + Upload
        </Link>
      </div>
      <div className="mt-8 divide-y divide-border border-t border-b border-border">
        {rows.map((row) => (
          <Link
            key={row.id}
            href={`/dashboard/images/${row.id}`}
            className="flex items-center justify-between py-4 transition hover:bg-surface"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-md bg-surface text-xs text-muted">
                IMG
              </div>
              <div>
                <p className="text-sm font-medium">{row.filename}</p>
                <p className="text-xs text-muted">
                  {row.createdAt.toLocaleDateString()}
                  {row.signed ? " · C2PA signed" : ""}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{row.viewCount}</p>
              <p className="text-xs text-muted">views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
