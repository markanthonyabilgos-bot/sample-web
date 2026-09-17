import { sql } from "@vercel/postgres";
import { readDB, writeDB } from "@/lib/db";
import { getServerSupabase, useSupabase } from "@/lib/supabaseServer";
const usePG = !!process.env.POSTGRES_URL;
const useSB = useSupabase();
export function uid(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
export async function getEvents() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("events").select("*").order("date"); return data || []; }
  if (usePG) { const { rows } = await sql`SELECT id, title, date, place, org, description FROM events ORDER BY date`; return rows; }
  return readDB().events;
}
export async function addEventDB(ev) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("events").insert(ev); return ev; }
  if (usePG) { await sql`INSERT INTO events (id, title, date, place, org, description) VALUES (${ev.id}, ${ev.title}, ${ev.date}, ${ev.place}, ${ev.org}, ${ev.description || ""})`; return ev; }
  const db = readDB(); db.events.push(ev); writeDB(db); return ev;
}
export async function updateEventDB(id, patch) {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("events").update(patch).eq("id", id).select(); return data?.[0] || { id, ...patch }; }
  if (usePG) {
    const cur = (await sql`SELECT * FROM events WHERE id=${id}`).rows[0] || {};
    const next = { ...cur, ...patch, id };
    await sql`UPDATE events SET title=${next.title}, date=${next.date}, place=${next.place}, org=${next.org}, description=${next.description || ""} WHERE id=${id}`;
    return next;
  }
  const db = readDB(); db.events = db.events.map((e) => (e.id === id ? { ...e, ...patch } : e)); writeDB(db);
  return db.events.find((e) => e.id === id);
}
export async function delEventDB(id) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("events").delete().eq("id", id); return; }
  if (usePG) { await sql`DELETE FROM events WHERE id = ${id}`; return; }
  const db = readDB(); db.events = db.events.filter(e => e.id !== id); writeDB(db);
}
export async function getAnnouncements() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("announcements").select("*").order("date", { ascending: false }); return data || []; }
  const db = readDB();
  return [...(db.announcements || [])].sort((a, b) => ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) || String(b.date).localeCompare(String(a.date)));
}
export async function addAnnouncementDB(a) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("announcements").insert(a); return a; }
  const db = readDB(); db.announcements.unshift(a); writeDB(db); return a;
}
export async function updateAnnouncementDB(id, patch) {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("announcements").update(patch).eq("id", id).select(); return data?.[0] || { id, ...patch }; }
  const db = readDB(); db.announcements = db.announcements.map((a) => (a.id === id ? { ...a, ...patch } : a)); writeDB(db);
  return db.announcements.find((a) => a.id === id);
}
export async function delAnnouncementDB(id) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("announcements").delete().eq("id", id); return; }
  const db = readDB(); db.announcements = db.announcements.filter((a) => a.id !== id); writeDB(db);
}
export async function getOrgs() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("orgs").select("*").order("name"); if (data && data.length) return data; }
  return readDB().orgs;
}
export async function addOrgDB(org) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("orgs").insert(org); return org; }
  const db = readDB(); db.orgs.push(org); writeDB(db); return org;
}
export async function delOrgDB(id) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("orgs").delete().eq("id", id); }
  const db = readDB(); db.orgs = db.orgs.filter((o) => o.id !== id); writeDB(db);
}
export async function updateOrgDB(id, patch) {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("orgs").update(patch).eq("id", id).select(); if (data?.[0]) return data[0]; }
  const db = readDB(); db.orgs = db.orgs.map((o) => (o.id === id ? { ...o, ...patch } : o)); writeDB(db);
  return db.orgs.find((o) => o.id === id);
}
export async function getGallery() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("gallery").select("*").order("created_at", { ascending: false }); if (data && data.length) return data; }
  const db = readDB(); return db.gallery || [];
}
export async function addGalleryDB(item) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("gallery").insert(item); return item; }
  const db = readDB(); db.gallery = db.gallery || []; db.gallery.unshift(item); writeDB(db); return item;
}
export async function delGalleryDB(id) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("gallery").delete().eq("id", id); }
  const db = readDB(); db.gallery = (db.gallery || []).filter((g) => g.id !== id); writeDB(db);
}
export async function getRsvps() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("rsvps").select("*").order("at", { ascending: false }).limit(200); if (data) return data; }
  return readDB().rsvps || [];
}
export async function addRsvpDB(r) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("rsvps").insert(r); return r; }
  const db = readDB(); db.rsvps.push(r); writeDB(db); return r;
}
export async function delRsvpDB(id) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("rsvps").delete().eq("id", id); }
  const db = readDB(); db.rsvps = (db.rsvps || []).filter((x) => x.id !== id && x.at !== id); writeDB(db);
}
export async function getContacts() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("inbox").select("*").order("at", { ascending: false }).limit(200); if (data) return data; }
  return readDB().contacts || [];
}
export async function addContactDB(c) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("inbox").insert(c); return c; }
  const db = readDB(); db.contacts.push(c); writeDB(db); return c;
}
export async function delContactDB(id) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("inbox").delete().eq("id", id); }
  const db = readDB(); db.contacts = (db.contacts || []).filter((x) => x.id !== id && x.at !== id); writeDB(db);
}
export async function getPolls() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("polls").select("*").order("created_at", { ascending: false }); if (data && data.length) return data; }
  const db = readDB(); return db.polls || [];
}
export async function addPollDB(p) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("polls").insert(p); return p; }
  const db = readDB(); db.polls = db.polls || []; db.polls.unshift(p); writeDB(db); return p;
}
export async function delPollDB(id) {
  if (useSB) { const sb = getServerSupabase(); await sb.from("poll_votes").delete().eq("poll_id", id); await sb.from("polls").delete().eq("id", id); }
  const db = readDB(); db.polls = (db.polls || []).filter((p) => p.id !== id); db.poll_votes = (db.poll_votes || []).filter((v) => v.poll_id !== id); writeDB(db);
}
export async function votePollDB(poll_id, option) {
  const v = { id: uid("v"), poll_id, option, at: new Date().toISOString() };
  if (useSB) { const sb = getServerSupabase(); await sb.from("poll_votes").insert(v); return v; }
  const db = readDB(); db.poll_votes = db.poll_votes || []; db.poll_votes.push(v); writeDB(db); return v;
}
export async function getPollVotes(poll_id) {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("poll_votes").select("*").eq("poll_id", poll_id).limit(2000); return data || []; }
  const db = readDB(); return (db.poll_votes || []).filter((v) => v.poll_id === poll_id);
}
export async function toggleReactionDB(target, emoji, name) {
  const r = { id: uid("rx"), target, emoji, name: name || "anon", at: new Date().toISOString() };
  if (useSB) {
    const sb = getServerSupabase();
    const { data } = await sb.from("reactions").select("id").eq("target", target).eq("emoji", emoji).eq("name", r.name).limit(1);
    if (data && data.length) { await sb.from("reactions").delete().eq("id", data[0].id); return { removed: true }; }
    await sb.from("reactions").insert(r); return r;
  }
  const db = readDB(); db.reactions = db.reactions || [];
  const ix = db.reactions.findIndex((x) => x.target === target && x.emoji === emoji && x.name === r.name);
  if (ix >= 0) { db.reactions.splice(ix, 1); writeDB(db); return { removed: true }; }
  db.reactions.push(r); writeDB(db); return r;
}
export async function getReactions() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("reactions").select("*").limit(2000); return data || []; }
  const db = readDB(); return db.reactions || [];
}
export async function addSubscriberDB(email) {
  const s = { id: uid("s"), email, at: new Date().toISOString() };
  if (useSB) { const sb = getServerSupabase(); await sb.from("newsletter").insert(s); return s; }
  const db = readDB(); db.newsletter = db.newsletter || [];
  if (!db.newsletter.find((x) => x.email === email)) db.newsletter.push(s);
  writeDB(db); return s;
}
export async function getSubscribers() {
  if (useSB) { const sb = getServerSupabase(); const { data } = await sb.from("newsletter").select("*").order("at", { ascending: false }).limit(500); return data || []; }
  const db = readDB(); return db.newsletter || [];
}
