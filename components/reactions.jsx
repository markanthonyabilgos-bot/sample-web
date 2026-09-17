"use client";
import { useEffect, useState } from "react";
const EMOJIS = ["👍", "❤️", "🎉", "🔥"];
export default function Reactions({ target }) {
  const [counts, setCounts] = useState({});
  const load = () => fetch("/api/reactions").then((r) => r.json()).then((d) => {
    const c = {};
    (d.reactions || []).filter((x) => x.target === target).forEach((x) => { c[x.emoji] = (c[x.emoji] || 0) + 1; });
    setCounts(c);
  }).catch(() => {});
  useEffect(() => { load(); }, [target]);
  async function react(emoji) {
    const name = localStorage.getItem("student_name") || "anon-" + Math.random().toString(36).slice(2, 6);
    localStorage.setItem("student_name", name);
    await fetch("/api/reactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target, emoji, name }) });
    load();
  }
  return (
    <div className="flex gap-1 mt-2">
      {EMOJIS.map((e) => (
        <button key={e} onClick={() => react(e)} className="btn-pop text-xs border border-teal-100 bg-white rounded-full px-2 py-0.5 hover:border-teal-400">
          {e} {counts[e] ? counts[e] : ""}
        </button>
      ))}
    </div>
  );
}
