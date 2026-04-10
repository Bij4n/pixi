import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav — barely there */}
      <nav className="flex items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-mono text-xs font-medium tracking-widest uppercase"
        >
          Pixi
        </Link>
        <Link
          href={signedIn ? "/dashboard" : "/login"}
          className="text-xs text-muted transition hover:text-foreground"
        >
          {signedIn ? "Dashboard" : "Sign in"}
        </Link>
      </nav>

      {/* The one moment */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        {/* The image card */}
        <div className="relative w-full max-w-xs">
          {/* Faux image */}
          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800">
            <div className="flex h-full items-end p-5">
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-stone-800 shadow-sm backdrop-blur dark:bg-black/70 dark:text-stone-200">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                12 people viewed this
              </div>
            </div>
          </div>

          {/* Subtle pulse dot — top right */}
          <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-10 max-w-md text-center text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
          Know where your images end up.
        </h1>

        {/* One-liner */}
        <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-muted">
          Pixi embeds invisible tracking into any image. You see every open,
          every share, every forward — signed with C2PA content credentials.
        </p>

        {/* CTA */}
        <Link
          href={signedIn ? "/dashboard/upload" : "/signup"}
          className="mt-8 rounded-full bg-foreground px-7 py-2.5 text-sm font-medium text-background transition hover:opacity-85"
        >
          {signedIn ? "Upload an image" : "Try it free"}
        </Link>
      </main>

      {/* Footer links — quiet */}
      <footer className="flex items-center justify-center gap-6 px-6 pb-8 text-xs text-muted">
        <Link href="#how" className="transition hover:text-foreground">
          How it works
        </Link>
        <span className="text-border">&middot;</span>
        <Link href="/privacy" className="transition hover:text-foreground">
          Privacy
        </Link>
        <span className="text-border">&middot;</span>
        <Link href="/terms" className="transition hover:text-foreground">
          Terms
        </Link>
      </footer>

      {/* How it works — below the fold, minimal */}
      <section id="how" className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-md">
          <h2 className="text-lg font-medium tracking-tight">How it works</h2>
          <ol className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
            <li className="flex gap-4">
              <span className="font-mono text-xs font-medium text-foreground">
                1
              </span>
              <span>
                Upload any image. Pixi adds an invisible tracking pixel and
                signs the metadata with C2PA credentials.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-xs font-medium text-foreground">
                2
              </span>
              <span>
                Share it anywhere — email, social, docs. It looks and works
                exactly like the original.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-xs font-medium text-foreground">
                3
              </span>
              <span>
                See who opens it. Every view, every forward, logged in real
                time. Provenance is cryptographically verifiable.
              </span>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
