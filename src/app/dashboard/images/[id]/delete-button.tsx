"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ imageId }: { imageId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setDeleting(true);

    const res = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to delete image");
      setDeleting(false);
      setConfirming(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-red-500">Delete?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-500 underline transition hover:text-red-600 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Yes"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="text-muted underline transition hover:text-foreground"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-red-500 transition hover:text-red-600"
      >
        Delete image
      </button>
      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
