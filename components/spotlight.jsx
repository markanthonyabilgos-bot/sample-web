"use client";
import { useEffect, useState } from "react";
import { Reveal, Tilt } from "@/components/fx";
export default function Spotlight() {
  const [club, setClub] = useState(null);
  useEffect(() => {
    fetch("/api/orgs").then((r) => r.json()).then((d) => {
      const orgs = d.orgs || [];
      if (!orgs.length) return;
      const week = Math.floor(Date.now() / (7 * 86400000));
      setClub(orgs[week % orgs.length]);
    }).catch(() => {});
  }, []);
  if (!club) return null;
  return (
    <Reveal>
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <Tilt className="rounded-2xl bg-gradient-to-r from-teal-800 to-teal-600 text-white p-6 flex flex-wrap items-center gap-4">
          <div className="text-4xl">⭐</div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs font-bold tracking-widest text-teal-200">CLUB OF THE WEEK</p>
            <h3 className="text-xl font-bold">{club.name}</h3>
            <p className="text-sm text-white/80">{club.desc} · {club.members} members · {club.day}</p>
          </div>
          <a href="/organizations" className="btn-pop bg-white text-teal-900 px-4 py-2 rounded-full text-sm font-bold">Meet them</a>
        </Tilt>
      </div>
    </Reveal>
  );
}
