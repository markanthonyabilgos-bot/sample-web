"use client";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/fx";
function badgeFor(n) {
  if (n >= 3) return "Joined 3 events 🎖️";
  if (n === 2) return "Regular 🎗️";
  if (n === 1) return "Newcomer 🌱";
  return null;
}
export default function Leaderboard() {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    Promise.all([
      fetch("/api/rsvp").then((r) => (r.ok ? r.json() : { rsvps: [] })).catch(() => ({ rsvps: [] })),
      fetch("/api/events").then((r) => r.json()).catch(() => ({ events: [] })),
    ]).then(([rv, ev]) => {
      const byEvent = {};
      (rv.rsvps || []).forEach((r) => { byEvent[r.eventId] = (byEvent[r.eventId] || 0) + 1; });
      const evById = {};
      (ev.events || []).forEach((e) => { evById[e.id] = e; });
      const byName = {};
      (rv.rsvps || []).forEach((r) => { byName[r.name] = (byName[r.name] || 0) + 1; });
      const topFans = Object.entries(byName).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const topEvents = Object.entries(byEvent).sort((a, b) => b[1] - a[1]).slice(0, 5);
      setRows({ topFans, topEvents, evById });
    });
  }, []);
  if (!rows) return null;
  if (!rows.topFans.length) return null;
  return (
    <Reveal>
      <div className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-2 gap-4">
        <div className="border border-teal-100 bg-white rounded-xl p-5">
          <h3 className="font-bold text-teal-900">🏆 Most active students</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {rows.topFans.map(([name, n], i) => (
              <li key={name} className="flex justify-between items-center">
                <span>{["🥇", "🥈", "🥉"][i] || "•"} <b>{name}</b> <span className="text-slate-400">· {n} RSVP(s)</span></span>
                {badgeFor(n) && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">{badgeFor(n)}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-teal-100 bg-white rounded-xl p-5">
          <h3 className="font-bold text-teal-900">🔥 Hottest events</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {rows.topEvents.map(([id, n]) => (
              <li key={id} className="flex justify-between"><span><b>{rows.evById[id]?.title || id}</b></span><span className="text-slate-500">{n} going</span></li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
