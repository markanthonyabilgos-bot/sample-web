"use client";
import { useState } from "react";
import { api, toast, inputCls, btnP } from "./page";
export default function EventsPanel({ events, onDone, onDel }) {
  const [f, setF] = useState({ id: "", title: "", date: "", place: "", org: "", description: "" });
  async function save(e) {
    e.preventDefault();
    try {
      if (!f.title || !f.date) return toast("Title + date required", true);
      await api("/api/events", { method: f.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      setF({ id: "", title: "", date: "", place: "", org: "", description: "" });
      toast("Event saved"); onDone();
    } catch (err) { toast(err.message, true); }
  }
  return (
    <div className="mt-6 grid lg:grid-cols-[300px_1fr] gap-4">
      <form onSubmit={save} className="border border-teal-100 bg-white rounded-xl p-4 space-y-2 h-fit">
        <h2 className="font-bold text-teal-900">{f.id ? "Edit event" : "Add event"}</h2>
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title*" className={inputCls} />
        <input value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} type="date" className={inputCls} />
        <input value={f.place} onChange={(e) => setF({ ...f, place: e.target.value })} placeholder="Venue" className={inputCls} />
        <input value={f.org} onChange={(e) => setF({ ...f, org: e.target.value })} placeholder="Club / org" className={inputCls} />
        <textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Description" rows={3} className={inputCls} />
        <button className={btnP}>{f.id ? "Save" : "Add"}</button>
      </form>
      <div className="space-y-2">
        {events.map((ev) => (
          <div key={ev.id} className="text-sm border border-teal-100 bg-white rounded-lg p-3 flex justify-between items-center gap-2">
            <span><b>{ev.date}</b> — {ev.title} <span className="text-slate-500">@ {ev.place} · {ev.org}</span></span>
            <span className="flex gap-1 shrink-0">
              <button onClick={() => setF({ id: ev.id, title: ev.title || "", date: ev.date || "", place: ev.place || "", org: ev.org || "", description: ev.description || "" })} className="border border-teal-200 px-2 py-0.5 rounded-full">Edit</button>
              <button onClick={() => onDel(ev.id)} className="text-red-600 border border-red-200 px-2 py-0.5 rounded-full">Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
