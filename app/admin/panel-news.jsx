"use client";
import { useState } from "react";
import { api, toast, inputCls, btnP } from "./page";
export default function NewsPanel({ news, onDone, onDel }) {
  const [f, setF] = useState({ id: "", title: "", body: "", pinned: false, category: "General" });
  async function save(e) {
    e.preventDefault();
    try {
      if (!f.title) return toast("Title required", true);
      await api("/api/announcements", { method: f.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      setF({ id: "", title: "", body: "", pinned: false, category: "General" });
      toast("Saved"); onDone();
    } catch (err) { toast(err.message, true); }
  }
  async function pin(a) {
    try { await api("/api/announcements", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id, pinned: !a.pinned }) }); onDone(); }
    catch (err) { toast(err.message, true); }
  }
  return (
    <div className="mt-6 grid lg:grid-cols-[300px_1fr] gap-4">
      <form onSubmit={save} className="border border-teal-100 bg-white rounded-xl p-4 space-y-2 h-fit">
        <h2 className="font-bold text-teal-900">{f.id ? "Edit" : "Post"} announcement</h2>
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title*" className={inputCls} />
        <textarea value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} placeholder="Body" rows={3} className={inputCls} />
        <input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} placeholder="Category" className={inputCls} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.pinned} onChange={(e) => setF({ ...f, pinned: e.target.checked })} /> Pinned</label>
        <button className={btnP}>{f.id ? "Save" : "Post"}</button>
      </form>
      <div className="space-y-2">
        {news.map((n) => (
          <div key={n.id} className="text-sm border border-teal-100 bg-white rounded-lg p-3">
            <div className="flex justify-between items-center gap-2">
              <b className="text-teal-900">{n.pinned ? "PINNED " : ""}{n.title}</b>
              <span className="flex gap-1 shrink-0">
                <button onClick={() => pin(n)} className="border border-teal-200 px-2 py-0.5 rounded-full">{n.pinned ? "Unpin" : "Pin"}</button>
                <button onClick={() => setF({ id: n.id, title: n.title || "", body: n.body || "", pinned: !!n.pinned, category: n.category || "General" })} className="border border-teal-200 px-2 py-0.5 rounded-full">Edit</button>
                <button onClick={() => onDel(n.id)} className="text-red-600 border border-red-200 px-2 py-0.5 rounded-full">Delete</button>
              </span>
            </div>
            <p className="text-slate-600 mt-1">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
