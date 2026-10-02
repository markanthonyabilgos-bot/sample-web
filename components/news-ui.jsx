"use client";
import { useEffect, useState } from "react";
import { Reveal, Skeleton } from "@/components/fx";
import Reactions from "@/components/reactions";
const badgeColors = { General: "bg-teal-100 text-teal-800", Event: "bg-teal-700 text-white", Urgent: "bg-pine text-white", Sports: "bg-mint text-pine", Arts: "bg-teal-50 text-teal-900 border border-teal-200" };
function isNew(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00").getTime();
  if (isNaN(d)) return false;
  return Date.now() - d < 7 * 86400000;
}
export default function NewsUI() {
  const [news, setNews] = useState(null);
  const load = () => fetch("/api/announcements").then((r) => r.json()).then((d) => setNews(d.announcements || []));
  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-teal-950">Announcements <span className="live-dot ml-1" /> <span className="text-xs font-normal text-teal-600">live</span></h1>
      {!news && <div className="space-y-3 mt-4"><Skeleton /><Skeleton /><Skeleton /></div>}
      {(news || []).map((a, i) => (
        <Reveal key={a.id} delay={Math.min(i * 0.04, 0.3)}>
          <article className={"card-lift border rounded-xl px-4 my-3 py-4 " + (a.pinned ? "border-teal-300 bg-teal-50" : "border-teal-100 bg-white")}>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-teal-700/70">{a.date}</p>
              <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (badgeColors[a.category] || badgeColors.General)}>{(a.category || "General").toUpperCase()}</span>
              {a.pinned && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-700 text-white">PINNED</span>}
              {isNew(a.date) && <span className="new-pulse text-[10px] font-bold px-2 py-0.5 rounded-full bg-mint text-pine">NEW</span>}
            </div>
            <h2 className="font-bold text-teal-900 mt-1">{a.title}</h2>
            <p className="text-sm text-slate-700 mt-1">{a.body}</p>
            <Reactions target={a.id} />
          </article>
        </Reveal>
      ))}
    </div>
  );
}
