"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function SendPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: params.id, to, subject, body }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to send");
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
    setTimeout(() => {
      router.push(`/dashboard/images/${params.id}`);
      router.refresh();
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-lg">
      <Link
        href={`/dashboard/images/${params.id}`}
        className="text-xs text-muted transition hover:text-foreground"
      >
        ← Back to image
      </Link>
      <h1 className="mt-4 text-2xl font-medium tracking-tight">
        Send tracked image
      </h1>
      <p className="mt-2 text-sm text-muted">
        The recipient will receive the image embedded in the email. When they
        open it, a tracking event is logged.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="to" className="block text-xs font-medium text-muted">
            To
          </label>
          <input
            id="to"
            type="email"
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-xs font-medium text-muted"
          >
            Subject
          </label>
          <input
            id="subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label
            htmlFor="body"
            className="block text-xs font-medium text-muted"
          >
            Message
          </label>
          <textarea
            id="body"
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
        {sent && (
          <p className="text-xs text-emerald-500">Sent — redirecting…</p>
        )}
        <button
          type="submit"
          disabled={sending || sent}
          className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background transition hover:opacity-85 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
