"use client";
import { useEffect, useState } from "react";
import { inputCls, btnP, toast } from "./page";
export default function UploadBox({ onDone }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  async function upload(e) {
    e.preventDefault();
    if (!file) return toast("Pick a photo first", true);
    if (!title) return toast("Title required", true);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Upload failed");
      setFile(null); setTitle("");
      document.getElementById("gal-file").value = "";
      toast("Photo uploaded"); onDone();
    } catch (err) { toast(err.message, true); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = document.getElementById("gal-preview");
    if (img) img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <form onSubmit={upload} className="border border-teal-200 bg-teal-50/50 rounded-xl p-4 space-y-2">
      <h3 className="font-bold text-teal-900 text-sm">Upload photo (max 4MB)</h3>
      <input id="gal-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} className="text-sm" />
      {file && <img id="gal-preview" alt="preview" className="rounded-lg w-full h-32 object-cover" />}
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title*" className={inputCls} />
      <button className={btnP} disabled={busy}>{busy ? "Uploading…" : "Upload"}</button>
    </form>
  );
}
