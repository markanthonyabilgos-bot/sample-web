"use client";
import { useEffect, useState } from "react";
import { Reveal, Skeleton } from "@/components/fx";
import Reactions from "@/components/reactions";
export default function ArchivePage() {
  const [news, setNews] = useState(null);
  const [q, setQ] = useState("");
  useEffect(() => { fetch("/api/announcements").then((r) => r.json()).then((d) => setNews(d.announcements || [])).catch(() => setNews([])); }, []);
  const list = (news || []).filter((a) => (q ? (a.title + " " + (a.body || "")).toLowerCase().includes(q.toLowerCase()) : true));
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-teal-950">Announcements archive</h1>
      <p className="text-sm text-slate-600 mt-1">Every announcement ever posted, searchable. Subscribe for Friday roundups below.</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search archive…" className="border border-teal-200 rounded-full px-3 py-1.5 text-sm bg-white outline-none mt-4 w-full" />
      {!news && <div className="space-y-3 mt-4"><Skeleton /><Skeleton /></div>}
      {list.map((a) => (
        <Reveal key={a.id}>
          <article className="border border-teal-100 bg-white rounded-xl px-4 my-3 py-4">
            <p className="text-xs text-teal-700/70">{a.date} · {(a.category || "General").toUpperCase()}</p>
            <h2 className="font-bold text-teal-900">{a.title}</h2>
            <p className="text-sm text-slate-700 mt-1">{a.body}</p>
            <Reactions target={a.id} />
          </article>
        </Reveal>
      ))}
    </div>
  );
}
