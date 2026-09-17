"use client";
import { useEffect, useState } from "react";
import { Reveal, Skeleton, Tilt } from "@/components/fx";
export default function ClubsUI() {
  const [orgs, setOrgs] = useState(null);
  useEffect(() => { fetch("/api/orgs").then((r) => r.json()).then((d) => setOrgs(d.orgs || [])).catch(() => setOrgs([])); }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-teal-950">Clubs & Organizations</h1>
      <p className="text-teal-900/70 mt-2">Show up twice, then register with the advisor. No fees except Robotics (200/yr for parts).</p>
      {!orgs && <div className="grid md:grid-cols-2 gap-4 mt-6"><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {(orgs || []).map((o, i) => (
          <Reveal key={o.id} delay={Math.min(i * 0.05, 0.3)}>
            <Tilt className="card-lift border border-teal-100 bg-white rounded-xl p-5">
              <h2 className="font-bold text-lg text-teal-900">{o.name}</h2>
              <p className="text-sm text-slate-600 mt-1">{o.desc}</p>
              <p className="text-sm mt-2 text-teal-800">{o.day} · Adviser: {o.advisor} · {o.members} members</p>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
