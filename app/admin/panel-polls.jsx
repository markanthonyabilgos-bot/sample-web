"use client";
import { useState } from "react";
import { api, toast, inputCls, btnP } from "./page";
export default function PollsPanel({ polls, onDone, onDel }) {
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState("Option A, Option B, Option C");
  async function save(e) {
    e.preventDefault();
    try {
      if (!q) return toast("Question required", true);
      const options = opts.split(",").map((s) => s.trim()).filter(Boolean);
      if (options.length < 2) return toast("At least 2 options", true);
      await api("/api/polls", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, options }) });
      setQ(""); toast("Poll posted — live on home + /polls"); onDone();
    } catch (err) { toast(err.message, true); }
  }
  return (
    <div className="mt-6 grid lg:grid-cols-[300px_1fr] gap-4">
      <form onSubmit={save} className="border border-teal-100 bg-white rounded-xl p-4 space-y-2 h-fit">
        <h2 className="font-bold text-teal-900">New poll</h2>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Question*" className={inputCls} />
        <textarea value={opts} onChange={(e) => setOpts(e.target.value)} rows={3} className={inputCls} />
        <p className="text-xs text-slate-400">Comma-separated options</p>
        <button className={btnP}>Post poll</button>
      </form>
      <div className="space-y-2">
        {polls.map((p) => (
          <div key={p.id} className="text-sm border border-teal-100 bg-white rounded-lg p-3 flex justify-between items-center gap-2">
            <span><b>{p.question}</b> <span className="text-slate-500">· {(p.options || []).join(" / ")}</span></span>
            <button onClick={() => onDel(p.id)} className="text-red-600 border border-red-200 px-2 py-0.5 rounded-full shrink-0">Delete</button>
          </div>
        ))}
        {polls.length === 0 && <p className="text-sm text-slate-500">No polls yet.</p>}
      </div>
    </div>
  );
}
