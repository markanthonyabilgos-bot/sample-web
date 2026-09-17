"use client";
import { useState } from "react";
export default function MonthView({ events, onPick }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const first = new Date(cursor.y, cursor.m, 1);
  const startDay = first.getDay();
  const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const byDay = {};
  (events || []).forEach((e) => { (byDay[e.date] = byDay[e.date] || []).push(e); });
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(cursor.y + "-" + String(cursor.m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0"));
  const label = first.toLocaleString("en", { month: "long", year: "numeric" });
  const prev = () => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const nextM = () => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));
  return (
    <div className="border border-teal-100 bg-white rounded-xl p-4">
      <div className="flex items-center justify-between">
        <button onClick={prev} className="border rounded-full px-3 py-0.5">‹</button>
        <b className="text-teal-900">{label}</b>
        <button onClick={nextM} className="border rounded-full px-3 py-0.5">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mt-3 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="text-slate-400 font-bold">{d}</div>)}
        {cells.map((day, i) => (
          <div key={i} className={"rounded-lg p-1 min-h-[44px] border " + (day && byDay[day] ? "border-teal-400 bg-teal-50" : "border-transparent")}>
            {day && (<>
              <div className="text-slate-600">{Number(day.slice(8))}</div>
              {(byDay[day] || []).slice(0, 2).map((e) => (
                <button key={e.id} onClick={() => onPick(e.id)} className="block w-full truncate text-[10px] bg-teal-700 text-white rounded px-1 mt-0.5">{e.title}</button>
              ))}
            </>)}
          </div>
        ))}
      </div>
    </div>
  );
}
