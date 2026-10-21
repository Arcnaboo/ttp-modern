"use client";

import { useState, type ChangeEvent } from "react";

export function AdminFileField({
  name,
  label,
  accept = "image/*",
  kind = "image",
  required = false,
}: {
  name: string;
  label: string;
  accept?: string;
  kind?: "image" | "document";
  required?: boolean;
}) {
  const [path, setPath] = useState("");
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPath("");
      setPreview("");
      setStatus("idle");
      setMessage("");
      return;
    }
    setStatus("uploading");
    setMessage("Yükleniyor…");
    setPreview("");
    const body = new FormData();
    body.set("file", file);
    body.set("kind", kind);
    try {
      const response = await fetch("/admin/upload", { method: "POST", body, credentials: "same-origin" });
      const data = (await response.json()) as { path?: string; url?: string; error?: string };
      if (!response.ok || !data.path) {
        setPath("");
        setPreview("");
        setStatus("error");
        setMessage(data.error || "Yükleme başarısız.");
        event.target.value = "";
        return;
      }
      setPath(data.path);
      setPreview(data.url || `/${data.path}`);
      setStatus("done");
      setMessage("Dosya yüklendi. Kaydet’e basın.");
    } catch {
      setPath("");
      setPreview("");
      setStatus("error");
      setMessage("Yükleme başarısız.");
      event.target.value = "";
    }
  }

  return (
    <label>
      {label}
      <input type="file" accept={accept} required={required && !path} onChange={onChange} disabled={status === "uploading"} />
      <input type="hidden" name={`${name}_path`} value={path} />
      {message ? (
        <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: status === "error" ? "#991B1B" : "#64748B" }}>
          {message}
        </span>
      ) : null}
      {preview && kind === "image" ? (
        <img src={preview} alt="" width={72} height={72} style={{ display: "block", marginTop: 8, objectFit: "cover" }} />
      ) : null}
    </label>
  );
}
