"use client";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { Reveal, Skeleton } from "@/components/fx";
export function useCountdown(targetDate) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!targetDate) return null;
  const diff = new Date(targetDate + "T08:00:00").getTime() - now;
  if (isNaN(diff) || diff <= 0) return null;
  return { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
}
export function calLink(ev) {
  const dt = (ev.date || "").replace(/-/g, "");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(ev.title || "School event") + "&dates=" + dt + "T000000/" + dt + "T010000&details=" + encodeURIComponent((ev.org || "") + " @ " + (ev.place || ""));
}
export function pop() {
  confetti({ particleCount: 120, spread: 75, origin: { y: 0.7 }, colors: ["#0e7c6b", "#14b8a6", "#fbbf24", "#ffffff"] });
}
export function useEvents() {
  const [events, setEvents] = useState(null);
  const load = () => fetch("/api/events").then((r) => r.json()).then((d) => setEvents(d.events || []));
  useEffect(() => {
    load();
    const sb = getBrowserSupabase();
    if (sb) {
      const ch = sb.channel("events-live").on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => load()).subscribe();
      return () => { sb.removeChannel(ch); };
    }
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);
  return [events, load];
}
