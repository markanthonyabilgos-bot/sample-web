"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
export default function SiteSearch() {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ orgs: [], events: [], news: [] });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    Promise.all([
      fetch("/api/orgs").then((r) => r.json()).catch(() => ({})),
      fetch("/api/events").then((r) => r.json()).catch(() => ({})),
      fetch("/api/announcements").then((r) => r.json()).catch(() => ({})),
    ]).then(([o, e, n]) => setData({ orgs: o.orgs || [], events: e.events || [], news: n.announcements || [] }));
  }, []);
  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const s = q.toLowerCase();
    const out = [];
    data.orgs.forEach((o) => { if ((o.name + " " + (o.desc || "")).toLowerCase().includes(s)) out.push({ type: "Club", title: o.name, sub: o.advisor, href: "/organizations" }); });
    data.events.forEach((e) => { if ((e.title + " " + (e.org || "") + " " + (e.place || "")).toLowerCase().includes(s)) out.push({ type: "Event", title: e.title, sub: e.date, href: "/events" }); });
    data.news.forEach((a) => { if ((a.title + " " + (a.body || "")).toLowerCase().includes(s)) out.push({ type: "News", title: a.title, sub: a.date, href: "/announcements" }); });
    return out.slice(0, 8);
  }, [q, data]);
  return (
    <div className="relative">
      <label htmlFor="site-search" className="sr-only">Search programs, events, news</label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search programs, events, news…"
        aria-expanded={open && results.length > 0}
        aria-controls="site-search-results"
        className="border border-white/30 bg-white/10 placeholder-white/50 rounded-full px-3 py-1 text-xs w-44 md:w-56 outline-none focus:bg-white/20 focus-visible:ring-2 focus-visible:ring-mint"
      />
      {open && results.length > 0 && (
        <div id="site-search-results" role="listbox" aria-label="Search results" className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-teal-100 overflow-hidden z-50">
          {results.map((r, i) => (
            <Link key={i} href={r.href} className="block px-3 py-2 text-xs hover:bg-teal-50 border-b border-teal-50 last:border-0">
              <span className="font-bold text-teal-700">[{r.type}]</span> <b>{r.title}</b> <span className="text-slate-400">{r.sub}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
