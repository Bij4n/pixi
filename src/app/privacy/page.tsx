import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs text-center">
        <Link
          href="/"
          className="font-mono text-xs font-medium tracking-widest uppercase"
        >
          Pixi
        </Link>
        <h1 className="mt-10 text-xl font-medium tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted">
          Will be published before launch.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-xs text-muted transition hover:text-foreground"
        >
          &larr; Back to home
        </Link>
      </div>
    </main>
  );
}
