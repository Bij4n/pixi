import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/"
        className="font-mono text-xs font-medium tracking-widest uppercase"
      >
        Pixi
      </Link>
      <h1 className="mt-10 text-2xl font-medium tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-xs text-muted">Last updated: April 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-sm font-medium text-foreground">
            What we collect
          </h2>
          <p className="mt-2">
            When you create an account, we store your email address and a salted
            hash of your password. We never store passwords in plain text.
          </p>
          <p className="mt-2">
            When you upload an image, we store the file, its metadata (filename,
            size, MIME type), and the cryptographic signature we generate for
            it.
          </p>
          <p className="mt-2">
            When someone opens a tracked image, we log the timestamp, IP
            address, user-agent string, and HTTP referer of the request. This
            data is visible only to you, the image owner.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">
            What we do not collect
          </h2>
          <p className="mt-2">
            We do not use third-party analytics or advertising networks. We do
            not sell your data. We do not build profiles of your recipients
            beyond what&apos;s strictly necessary to show you opens.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">
            How long we keep it
          </h2>
          <p className="mt-2">
            Account data is retained as long as your account exists. Images and
            events are retained until you delete the image or close your
            account, at which point we remove the stored file and all associated
            event rows.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">Your rights</h2>
          <p className="mt-2">
            You can export or delete your data at any time by emailing us.
            Account deletion permanently removes your uploaded images and all
            tracking events.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about this policy? Email{" "}
            <span className="font-mono">privacy@pixi.local</span>.
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
