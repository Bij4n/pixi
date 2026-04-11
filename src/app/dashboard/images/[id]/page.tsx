import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { images, events } from "@/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { DeleteButton } from "./delete-button";
import { detectForwards, countForwards } from "@/lib/forward-detection";

export default async function ImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/login");

  const image = db
    .select()
    .from(images)
    .where(and(eq(images.id, id), eq(images.userId, userId)))
    .get();

  if (!image) notFound();

  const totalViews = db
    .select({ count: sql<number>`count(*)` })
    .from(events)
    .where(eq(events.imageId, id))
    .get();

  const allEvents = db
    .select()
    .from(events)
    .where(eq(events.imageId, id))
    .orderBy(desc(events.createdAt))
    .all();

  const recentEvents = allEvents.slice(0, 20);
  const recipients = detectForwards(allEvents);
  const forwardCount = countForwards(recipients);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100";
  const trackedUrl = `${baseUrl}/t/${image.slug}`;

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-xs text-muted transition hover:text-foreground"
      >
        ← All images
      </Link>

      <div className="mt-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-medium tracking-tight">
          {image.filename}
        </h1>
        {image.c2paSigned && (
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
            ✓ C2PA signed
          </span>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/images/${image.id}/raw`}
          alt={image.filename}
          className="max-h-96 w-full object-contain"
        />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border border-border p-5">
          <p className="text-xs font-medium text-muted">Total views</p>
          <p className="mt-2 text-3xl font-semibold">
            {totalViews?.count ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="text-xs font-medium text-muted">Recipients</p>
          <p className="mt-2 text-3xl font-semibold">{recipients.length}</p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="text-xs font-medium text-muted">Forwards detected</p>
          <p className="mt-2 text-3xl font-semibold">
            {forwardCount}
            {forwardCount > 0 && (
              <span className="ml-2 align-middle text-xs font-medium text-amber-500">
                ⚠
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-xs font-medium text-muted">Tracked link</p>
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-surface p-3 font-mono text-xs">
          <span className="flex-1 overflow-x-auto">{trackedUrl}</span>
        </div>
        <div className="mt-3 flex gap-3 text-xs">
          <Link
            href={`/dashboard/images/${image.id}/send`}
            className="text-muted transition hover:text-foreground"
          >
            Send via email →
          </Link>
          <Link
            href={`/verify/${image.slug}`}
            target="_blank"
            className="text-muted transition hover:text-foreground"
          >
            Verify provenance →
          </Link>
          <a
            href={`/api/images/${image.id}/events.csv`}
            className="text-muted transition hover:text-foreground"
          >
            Export CSV →
          </a>
          <DeleteButton imageId={image.id} />
        </div>
      </div>

      {recipients.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-medium">Recipients</h2>
          <p className="mt-1 text-xs text-muted">
            {forwardCount === 0
              ? "Seen by the original recipient only."
              : `Detected ${forwardCount} forward${forwardCount === 1 ? "" : "s"} beyond the original recipient.`}
          </p>
          <div className="mt-4 divide-y divide-border border-t border-b border-border">
            {recipients.map((r) => (
              <div
                key={r.ip}
                className="flex items-center justify-between py-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex size-2 rounded-full ${
                      r.isOriginal ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{r.ip}</p>
                    <p className="mt-0.5 text-muted">
                      {r.isOriginal ? "Original recipient" : "Forward"} ·{" "}
                      {r.opens} open{r.opens === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <p className="text-muted">
                  First seen {r.firstSeen.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-sm font-medium">Recent views</h2>
        {recentEvents.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            No views yet. Share the tracked link to see events appear here.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border border-t border-b border-border text-xs">
            {recentEvents.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium">{e.ip ?? "Unknown IP"}</p>
                  <p className="mt-0.5 text-muted">
                    {(e.userAgent ?? "No user-agent").slice(0, 80)}
                  </p>
                </div>
                <p className="text-muted">
                  {new Date(e.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
