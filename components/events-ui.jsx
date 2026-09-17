"use client";
import { useMemo, useState } from "react";
import { calLink, pop, useCountdown, useEvents } from "@/components/events-core";
import MonthView from "@/components/events-cal";
import { Reveal, Skeleton } from "@/components/fx";
export default function EventsUI() {
  const [events, load] = useEvents();
  const [name, setName] = useState("");
  const [eventId, setEventId] = useState("");
  const [q, setQ] = useState("");
  const [club, setClub] = useState("All");
  const [view, setView] = useState("list");
  const clubs = useMemo(() => ["All", ...new Set((events || []).map((e) => e.org).filter(Boolean))], [events]);
  const filtered = useMemo(() => {
    return (events || [])
      .filter((e) => (club === "All" || e.org === club))
      .filter((e) => (q ? (e.title + " " + (e.place || "") + " " + (e.org || "")).toLowerCase().includes(q.toLowerCase()) : true))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [events, q, club]);
  const next = filtered.filter((e) => e.date >= new Date().toISOString().slice(0, 10))[0] || filtered[0];
  const cd = useCountdown(next?.date);
  async function rsvp(e) {
    e.preventDefault();
    const r = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, eventId }) });
    if (r.ok) { pop(); setName(""); }
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-teal-950">Events <span className="live-dot ml-1" /> <span className="text-xs font-normal text-teal-600">live</span></h1>
      {next && cd && (
        <div className="mt-4 border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-wrap items-center gap-4">
          <div className="text-sm"><b>Next up: {next.title}</b> <span className="text-slate-600">· {next.date} @ {next.place}</span></div>
          <div className="flex gap-2 ml-auto">
            {[["Days", cd.d], ["Hrs", cd.h], ["Min", cd.m], ["Sec", cd.s]].map(([l, v]) => (
              <div key={l} className="bg-white border border-amber-200 rounded-lg px-3 py-1 text-center"><b className="text-lg text-teal-900">{String(v).padStart(2, "0")}</b><p className="text-[10px] text-slate-500">{l}</p></div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2 items-center text-sm">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="border border-teal-200 rounded-full px-3 py-1.5 bg-white outline-none" />
        <select value={club} onChange={(e) => setClub(e.target.value)} className="border border-teal-200 rounded-full px-3 py-1.5 bg-white outline-none">
          {clubs.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="ml-auto flex gap-1">
          <button onClick={() => setView("list")} className={view === "list" ? "bg-teal-700 text-white px-3 py-1 rounded-full" : "border border-teal-200 bg-white px-3 py-1 rounded-full"}>List</button>
          <button onClick={() => setView("cal")} className={view === "cal" ? "bg-teal-700 text-white px-3 py-1 rounded-full" : "border border-teal-200 bg-white px-3 py-1 rounded-full"}>Calendar</button>
        </div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div>
          {!events && (<div className="space-y-3"><Skeleton /><Skeleton /><Skeleton /></div>)}
          {view === "list" && (
            <div className="space-y-3">
              {filtered.map((ev, i) => (
                <Reveal key={ev.id} delay={Math.min(i * 0.04, 0.3)}>
                  <div className="card-lift border border-teal-100 bg-white rounded-xl p-4">
                    <b className="text-teal-900">{ev.title}</b>
                    <p className="text-sm text-slate-600">{ev.date} · {ev.place} · {ev.org}</p>
                    {ev.description && <p className="text-sm text-slate-500 mt-1">{ev.description}</p>}
                    <div className="mt-2 flex gap-2 text-xs">
                      <button onClick={() => setEventId(ev.id)} className="btn-pop bg-teal-700 text-white px-3 py-1 rounded-full">RSVP</button>
                      <a href={calLink(ev)} target="_blank" rel="noreferrer" className="btn-pop border border-teal-200 bg-white px-3 py-1 rounded-full">+ Google Calendar</a>
                    </div>
                  </div>
                </Reveal>
              ))}
              {filtered.length === 0 && events && <p className="text-sm text-slate-500">No events match.</p>}
            </div>
          )}
          {view === "cal" && <MonthView events={filtered} onPick={setEventId} />}
        </div>
        <form onSubmit={rsvp} className="card-lift border border-teal-100 bg-white rounded-xl p-5 h-fit md:sticky md:top-20">
          <h2 className="font-bold text-teal-900">RSVP</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="border border-teal-200 rounded w-full px-3 py-2 mt-3 text-sm outline-none" />
          <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="border border-teal-200 rounded w-full px-3 py-2 mt-2 text-sm outline-none">
            <option value="">Select event…</option>
            {(events || []).map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
          <button className="btn-pop bg-teal-700 text-white px-4 py-2 rounded-full mt-3 text-sm font-semibold">Confirm RSVP</button>
        </form>
      </div>
    </div>
  );
}
