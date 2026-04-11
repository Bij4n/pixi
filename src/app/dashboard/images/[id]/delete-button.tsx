"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ imageId }: { imageId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setDeleting(true);

    const res = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete image");
      setDeleting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs text-red-500 transition hover:text-red-600 disabled:opacity-50"
    >
      {deleting ? "Deleting…" : "Delete image"}
    </button>
  );
}
