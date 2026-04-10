"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Upload failed");
      setUploading(false);
      return;
    }

    const { id } = await res.json();
    router.push(`/dashboard/images/${id}`);
    router.refresh();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-medium tracking-tight">Upload an image</h1>
      <p className="mt-2 text-sm text-muted">
        We&apos;ll embed an invisible tracking pixel and sign it with C2PA
        credentials. PNG, JPEG, GIF, or WebP. Max 10MB.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 text-center transition ${
          dragging
            ? "border-foreground bg-surface"
            : "border-border hover:border-muted"
        }`}
      >
        <p className="text-sm font-medium">
          {uploading ? "Uploading…" : "Drop an image here"}
        </p>
        <p className="mt-1 text-xs text-muted">or click to choose a file</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
