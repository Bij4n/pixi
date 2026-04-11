"use client";

import { useState } from "react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to change password");
      setLoading(false);
      return;
    }

    setMessage("Password updated");
    setCurrentPassword("");
    setNewPassword("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
      <div>
        <label
          htmlFor="current-password"
          className="block text-xs font-medium text-muted"
        >
          Current password
        </label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
        />
      </div>
      <div>
        <label
          htmlFor="new-password"
          className="block text-xs font-medium text-muted"
        >
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
        />
      </div>
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
      {message && <p className="text-xs text-emerald-500">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-foreground px-5 py-2 text-xs font-medium text-background transition hover:opacity-85 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
