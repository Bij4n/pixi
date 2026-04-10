import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/"
        className="font-mono text-xs font-medium tracking-widest uppercase"
      >
        Pixi
      </Link>
      <h1 className="mt-10 text-2xl font-medium tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-xs text-muted">Last updated: April 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-sm font-medium text-foreground">
            Acceptable use
          </h2>
          <p className="mt-2">
            Pixi is a tool for tracking images you own or have permission to
            share. Do not use it to track images belonging to others without
            their consent, to harass or surveil people, or to circumvent privacy
            expectations. We reserve the right to suspend accounts that violate
            these principles.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">
            Content ownership
          </h2>
          <p className="mt-2">
            You retain all rights to the images you upload. We do not claim
            ownership of your content. You grant us a limited license to store,
            process, and serve your images for the sole purpose of providing the
            tracking service.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">
            Service availability
          </h2>
          <p className="mt-2">
            Pixi is provided as-is without warranty of uptime or accuracy. While
            we aim for high reliability, we cannot guarantee the service will
            always be available or that tracking data will be complete.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">Payments</h2>
          <p className="mt-2">
            Pixi is currently free to use. Paid plans will be introduced in the
            future; we will notify existing users before any subscription fees
            begin.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">Termination</h2>
          <p className="mt-2">
            You can close your account at any time. We may terminate accounts
            that violate these terms or engage in abuse. Upon termination, we
            delete your stored images and associated data.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Email{" "}
            <span className="font-mono">legal@pixi.local</span>.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-12 inline-block text-xs text-muted transition hover:text-foreground"
      >
        ← Back to home
      </Link>
    </main>
  );
}
