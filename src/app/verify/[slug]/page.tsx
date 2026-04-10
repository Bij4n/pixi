import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { images } from "@/db/schema";
import { readImage } from "@/lib/storage";
import { verifyImageBuffer } from "@/lib/c2pa";
import { notFound } from "next/navigation";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const image = db.select().from(images).where(eq(images.slug, slug)).get();

  if (!image) notFound();

  let verification;
  try {
    const buffer = await readImage(image.storagePath);
    verification = await verifyImageBuffer(buffer);
  } catch {
    verification = { signed: false as const };
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <Link
        href="/"
        className="font-mono text-xs font-medium tracking-widest uppercase"
      >
        Pixi
      </Link>

      <h1 className="mt-10 text-2xl font-medium tracking-tight">
        Content credentials
      </h1>
      <p className="mt-2 text-sm text-muted">
        Verifying the provenance of <strong>{image.filename}</strong>.
      </p>

      <div className="mt-8 rounded-xl border border-border p-6">
        {verification.signed ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                ✓
              </span>
              <p className="text-sm font-medium">Signature valid</p>
            </div>
            {verification.manifest && (
              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-muted">Issuer</dt>
                  <dd className="mt-0.5">{verification.manifest.issuer}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted">Signed at</dt>
                  <dd className="mt-0.5">
                    {new Date(verification.manifest.timestamp).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted">
                    Content hash
                  </dt>
                  <dd className="mt-0.5 break-all font-mono text-xs">
                    {verification.manifest.contentHash}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted">Signature</dt>
                  <dd className="mt-0.5 break-all font-mono text-xs">
                    {verification.manifest.signature.slice(0, 40)}…
                  </dd>
                </div>
              </dl>
            )}
          </>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                !
              </span>
              <p className="text-sm font-medium">
                Signature missing or invalid
              </p>
            </div>
            <p className="mt-3 text-sm text-muted">
              This image was not signed by Pixi, or the signature does not match
              the file contents.
            </p>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-muted">
        Signatures are generated using HMAC-SHA256 on upload. Any modification
        to the image after signing will invalidate this credential.
      </p>
    </main>
  );
}
