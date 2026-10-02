"use client";
import { useState } from "react";
import { api, toast, inputCls, btnP } from "./page";
import UploadBox from "./upload-box";
export default function MorePanels({ tab, orgs, gallery, rsvps, inbox, onDone, onDel }) {
  const [oF, setOF] = useState({ id: "", name: "", advisor: "", members: "", day: "", desc: "" });
  const [gF, setGF] = useState({ title: "", caption: "", image: "" });
  async function saveOrg(e) {
    e.preventDefault();
    try {
      if (!oF.name) return toast("Club name required", true);
      const payload = { ...oF, members: Number(oF.members) || 0 };
      await api("/api/orgs", { method: oF.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setOF({ id: "", name: "", advisor: "", members: "", day: "", desc: "" });
      toast("Club saved"); onDone();
    } catch (err) { toast(err.message, true); }
  }
  async function saveGal(e) {
    e.preventDefault();
    try {
      if (!gF.title) return toast("Title required", true);
      await api("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(gF) });
      setGF({ title: "", caption: "", image: "" });
      toast("Photo added"); onDone();
    } catch (err) { toast(err.message, true); }
  }
  if (tab === "gallery") return <GalView gF={gF} setGF={setGF} saveGal={saveGal} gallery={gallery} onDel={onDel} />;
  if (tab === "inbox") return <InboxView rsvps={rsvps} inbox={inbox} onDel={onDel} />;
  return (
    <div className="mt-6 grid lg:grid-cols-[300px_1fr] gap-4">
      <form onSubmit={saveOrg} className="border border-teal-100 bg-white rounded-xl p-4 space-y-2 h-fit">
        <h2 className="font-bold text-teal-900">{oF.id ? "Edit club" : "Add club"}</h2>
        <input value={oF.name} onChange={(e) => setOF({ ...oF, name: e.target.value })} placeholder="Club name*" className={inputCls} />
        <input value={oF.advisor} onChange={(e) => setOF({ ...oF, advisor: e.target.value })} placeholder="Adviser" className={inputCls} />
        <input value={oF.day} onChange={(e) => setOF({ ...oF, day: e.target.value })} placeholder="Day / place" className={inputCls} />
        <input value={oF.members} onChange={(e) => setOF({ ...oF, members: e.target.value })} placeholder="Members" type="number" className={inputCls} />
        <textarea value={oF.desc} onChange={(e) => setOF({ ...oF, desc: e.target.value })} placeholder="Description" rows={3} className={inputCls} />
        <button className={btnP}>{oF.id ? "Save" : "Add"}</button>
      </form>
      <div className="space-y-2">
        {orgs.map((o) => (
          <div key={o.id} className="text-sm border border-teal-100 bg-white rounded-lg p-3 flex justify-between items-center gap-2">
            <span><b>{o.name}</b> <span className="text-slate-500">· {o.advisor} · {o.day} · {o.members}</span></span>
            <span className="flex gap-1 shrink-0">
              <button onClick={() => setOF({ id: o.id, name: o.name || "", advisor: o.advisor || "", members: o.members ?? "", day: o.day || "", desc: o.desc || "" })} className="border border-teal-200 px-2 py-0.5 rounded-full">Edit</button>
              <button onClick={() => onDel("/api/orgs", o.id)} className="text-red-600 border border-red-200 px-2 py-0.5 rounded-full">Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
function GalView({ gF, setGF, saveGal, gallery, onDel }) {
  return (
    <div className="mt-6 grid lg:grid-cols-[300px_1fr] gap-4">
      <form onSubmit={saveGal} className="border border-teal-100 bg-white rounded-xl p-4 space-y-2 h-fit">
        <h2 className="font-bold text-teal-900">Add photo</h2>
        <UploadBox onDone={onDone} />
        <p className="text-xs text-slate-400 text-center">— or paste URL —</p>
        <input value={gF.title} onChange={(e) => setGF({ ...gF, title: e.target.value })} placeholder="Title*" className={inputCls} />
        <input value={gF.image} onChange={(e) => setGF({ ...gF, image: e.target.value })} placeholder="Image URL" className={inputCls} />
        <textarea value={gF.caption} onChange={(e) => setGF({ ...gF, caption: e.target.value })} placeholder="Caption" rows={2} className={inputCls} />
        <button className={btnP}>Add</button>
      </form>
      <div className="grid md:grid-cols-2 gap-2">
        {gallery.length === 0 && <p className="text-sm text-slate-500">No items yet.</p>}
        {gallery.map((g) => (
          <div key={g.id} className="text-sm border border-teal-100 bg-white rounded-lg p-3">
            {g.image ? <img src={g.image} alt={g.title} className="rounded-lg w-full h-32 object-cover" /> : <div className="rounded-lg w-full h-32 bg-teal-50" />}
            <b className="block mt-2">{g.title}</b>
            <button onClick={() => onDel("/api/gallery", g.id)} className="text-red-600 border px-2 py-0.5 rounded-full text-xs mt-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
function InboxView({ rsvps, inbox, onDel }) {
  return (
    <div className="mt-6 grid lg:grid-cols-2 gap-4">
      <div>
        <h2 className="font-bold text-teal-900">RSVPs ({rsvps.length})</h2>
        <div className="space-y-2 mt-2">
          {rsvps.map((r, i) => (
            <div key={r.id || i} className="text-sm border border-teal-100 bg-white rounded-lg p-2 flex justify-between items-center">
              <span><b>{r.name}</b> → {r.eventId}</span>
              <button onClick={() => onDel("/api/rsvp", r.id || r.at)} className="text-red-600 border px-2 py-0.5 rounded-full text-xs">Delete</button>
            </div>
          ))}
          {rsvps.length === 0 && <p className="text-sm text-slate-500">No RSVPs yet.</p>}
        </div>
      </div>
      <div>
        <h2 className="font-bold text-teal-900">Inbox ({inbox.length})</h2>
        <div className="space-y-2 mt-2">
          {inbox.map((c, i) => (
            <div key={c.id || i} className="text-sm border border-teal-100 bg-white rounded-lg p-2">
              <div className="flex justify-between items-center gap-2"><b>{c.name}</b><button onClick={() => onDel("/api/contact", c.id || c.at)} className="text-red-600 border px-2 py-0.5 rounded-full text-xs">Delete</button></div>
              <div className="flex flex-wrap gap-1 mt-1">
                {c.tour ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-700 text-white">TOUR REQUESTED</span> : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">APPLICATION</span>}
                {c.grade && <span className="text-[10px] px-2 py-0.5 rounded-full border border-teal-200 text-teal-900">{c.grade}</span>}
                {c.club && <span className="text-[10px] px-2 py-0.5 rounded-full border border-teal-200 text-teal-900">{c.club}</span>}
                {c.at && <span className="text-[10px] text-slate-500">{new Date(c.at).toLocaleString()}</span>}
              </div>
              <p className="text-slate-600 mt-1">{c.message}</p>
            </div>
          ))}
          {inbox.length === 0 && <p className="text-sm text-slate-500">No messages yet.</p>}
        </div>
      </div>
    </div>
  );
}
