"use client";
import { useEffect, useMemo, useState } from "react";
import EventsPanel from "./panel-events";
import NewsPanel from "./panel-news";
import MorePanels from "./panel-more";
import PollsPanel from "./panel-polls";
export function toast(msg, bad) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.className = "fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm text-white z-[99] " + (bad ? "bg-red-600" : "bg-teal-800");
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}
export async function api(path, opts) {
  const r = await fetch(path, opts);
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
}
export const inputCls = "border border-teal-200 rounded-lg px-2 py-1.5 text-sm w-full bg-white outline-none";
export const btnP = "btn-pop bg-teal-700 text-white px-3 py-1.5 rounded-full text-sm font-semibold";
export const btnG = "btn-pop border border-teal-200 bg-white px-3 py-1.5 rounded-full text-sm";
export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [polls, setPolls] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchJson(path, fallback) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch(path, { signal: ctrl.signal });
      if (!r.ok) return { data: fallback, ok: false };
      return { data: await r.json().catch(() => fallback), ok: true };
    } catch {
      return { data: fallback, ok: false };
    } finally {
      clearTimeout(t);
    }
  }
  const loadAll = async () => {
    const [e, n, o, g, rv, ib, pl, sb] = await Promise.all([
      fetchJson("/api/events", { events: [] }),
      fetchJson("/api/announcements", { announcements: [] }),
      fetchJson("/api/orgs", { orgs: [] }),
      fetchJson("/api/gallery", { gallery: [] }),
      fetchJson("/api/rsvp", { rsvps: [] }),
      fetchJson("/api/contact", { contacts: [] }),
      fetchJson("/api/polls", { polls: [] }),
      fetchJson("/api/newsletter", { subscribers: [] }),
    ]);
    setEvents(e.data.events || []); setNews(n.data.announcements || []); setOrgs(o.data.orgs || []);
    setGallery(g.data.gallery || []);
    setRsvps(rv.data.rsvps || []);
    setInbox(ib.data.contacts || []);
    setPolls(pl.data.polls || []);
    setSubs(sb.data.subscribers || []);
    if ([e, n, o, g, rv, ib, pl, sb].some((r) => !r.ok)) toast("Some sections were slow — showing partial data", true);
    setLoading(false);
  };
  useEffect(() => {
    loadAll();
  }, []);
  const nextEv = useMemo(() => {
    const t = new Date().toISOString().slice(0, 10);
    return [...events].filter((e) => e.date >= t).sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];
  }, [events]);
  async function del(path, id) {
    if (!confirm("Delete?")) return;
    try { await api(path + "?id=" + id, { method: "DELETE" }); toast("Deleted"); loadAll(); }
    catch (err) { toast(err.message, true); }
  }
  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10 text-sm text-slate-500">Loading…</div>;
  const tabs = [["dashboard", "Dashboard"], ["events", "Events (" + events.length + ")"], ["news", "News (" + news.length + ")"], ["clubs", "Clubs (" + orgs.length + ")"], ["gallery", "Gallery (" + gallery.length + ")"], ["polls", "Polls (" + polls.length + ")"], ["inbox", "Inbox (" + (rsvps.length + inbox.length) + ")"]];
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-teal-950">Admin Dashboard <span className="text-xs font-normal text-teal-600">live</span></h1>
        <div className="flex gap-2"><button onClick={loadAll} className={btnG}>Refresh</button></div>
      </div>
      <div className="flex gap-2 mt-4 flex-wrap">
        {tabs.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={tab === k ? "btn-pop bg-teal-700 text-white px-3 py-1 rounded-full text-sm" : "btn-pop border border-teal-200 bg-white px-3 py-1 rounded-full text-sm"}>{label}</button>
        ))}
      </div>
      {tab === "dashboard" && (
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {[["Events", events.length], ["News", news.length], ["Clubs", orgs.length], ["RSVPs", rsvps.length]].map(([t, v]) => (
            <div key={t} className="border border-teal-100 bg-white rounded-xl p-4"><p className="text-xs text-slate-500">{t}</p><p className="text-3xl font-bold text-teal-900">{v}</p></div>
          ))}
          <div className="md:col-span-4 border border-teal-100 bg-white rounded-xl p-4 text-sm"><b>Next:</b> {nextEv ? nextEv.title + " — " + nextEv.date : "none"} · Inbox {inbox.length} · Polls {polls.length} · Subscribers {subs.length}</div>
        </div>
      )}
      {tab === "events" && <EventsPanel events={events} onDone={loadAll} onDel={(id) => del("/api/events", id)} />}
      {tab === "news" && <NewsPanel news={news} onDone={loadAll} onDel={(id) => del("/api/announcements", id)} />}
      {tab === "polls" && <PollsPanel polls={polls} onDone={loadAll} onDel={(id) => del("/api/polls", id)} />}
      {(tab === "clubs" || tab === "gallery" || tab === "inbox") && (
        <MorePanels tab={tab} orgs={orgs} gallery={gallery} rsvps={rsvps} inbox={inbox} onDone={loadAll} onDel={del} />
      )}
    </div>
  );
}
