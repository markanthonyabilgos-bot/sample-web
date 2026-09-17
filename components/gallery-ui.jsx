"use client";
import { useEffect, useState } from "react";
import { Reveal, Skeleton } from "@/components/fx";
const fallback = [["Science fair, March", "Lab 1 was packed — 14 projects."], ["Mural day", "East hallway, Art Club + volunteers."], ["Clean-up crew", "Riverside Park, 22 bags collected."], ["Winter concert", "Hall A, full house."]];
export default function GalleryUI() {
  const [items, setItems] = useState(null);
  useEffect(() => { fetch("/api/gallery").then((r) => r.json()).then((d) => setItems(d.gallery && d.gallery.length ? d.gallery : null)).catch(() => setItems(null)); }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-teal-950">Gallery</h1>
      {!items && <div className="grid md:grid-cols-2 gap-4 mt-6"><Skeleton /><Skeleton /></div>}
      {items && (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {items.map((g, i) => (
            <Reveal key={g.id || i} delay={Math.min(i * 0.05, 0.3)}>
              <div className="card-lift rounded-xl overflow-hidden border border-teal-100 bg-white">
                {g.image ? <img src={g.image} alt={g.title} className="w-full h-56 object-cover" loading="lazy" /> : <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 h-56" />}
                <div className="p-4"><b className="text-teal-900">{g.title}</b><p className="text-sm text-teal-900/70">{g.caption}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
      {!items && (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {fallback.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div className="card-lift rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-100 p-8"><b className="text-teal-900">{t}</b><p className="text-sm text-teal-900/70">{d}</p></div>
            </Reveal>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500 mt-4">Photos by the Media Team. Admins: add real photos in /admin → Gallery.</p>
    </div>
  );
}
