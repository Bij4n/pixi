import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="font-mono text-xs font-medium tracking-widest uppercase"
            >
              Pixi
            </Link>
            <nav className="flex items-center gap-5 text-xs text-muted">
              <Link
                href="/dashboard"
                className="transition hover:text-foreground"
              >
                Images
              </Link>
              <Link
                href="/dashboard/upload"
                className="transition hover:text-foreground"
              >
                Upload
              </Link>
              <Link
                href="/dashboard/settings"
                className="transition hover:text-foreground"
              >
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted">{session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-muted transition hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
