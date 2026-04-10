import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
      <div className="mt-8 max-w-md space-y-8">
        <div>
          <p className="text-xs font-medium text-muted">Email</p>
          <p className="mt-1 text-sm">{session.user.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Plan</p>
          <p className="mt-1 text-sm">Free</p>
          <p className="mt-3 text-xs text-muted">Paid plans are coming soon.</p>
        </div>
      </div>
    </div>
  );
}
