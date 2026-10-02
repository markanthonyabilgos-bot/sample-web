"use client"; import { useState } from "react";
export default function Contact(){
  const [f,setF]=useState({name:"",grade:"",club:"",message:"",tour:false});
  const [ok,setOk]=useState(false);
  async function submit(e){
    e.preventDefault();
    const r = await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});
    if(r.ok) setOk(true);
  }
  if(ok) return (<div className="max-w-xl mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold text-teal-950">Thanks, {f.name.split(" ")[0] || "friend"}!</h1><p className="text-slate-600 mt-2">We received your application. We reply within 2 school days.</p></div>);
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <p className="text-xs font-bold text-teal-700 tracking-wide">ADMISSIONS</p>
      <h1 className="text-3xl font-bold text-teal-950 mt-1">Apply Now</h1>
      <p className="text-sm text-slate-600 mt-2">One form for applications and tour requests. No login required.</p>
      <form onSubmit={submit} className="mt-4">
        <label htmlFor="name" className="block text-sm font-semibold text-teal-900">Full name</label>
        <input id="name" placeholder="Full name" required value={f.name} onChange={e=>setF({...f,name:e.target.value})} className="border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none rounded-lg w-full px-3 py-2 mt-1 text-sm bg-white" />
        <label htmlFor="grade" className="block text-sm font-semibold text-teal-900 mt-3">Grade & section (e.g. 9-B)</label>
        <input id="grade" placeholder="Grade & section (e.g. 9-B)" value={f.grade} onChange={e=>setF({...f,grade:e.target.value})} className="border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none rounded-lg w-full px-3 py-2 mt-1 text-sm bg-white" />
        <label htmlFor="club" className="block text-sm font-semibold text-teal-900 mt-3">Program / club you want (e.g. Design Studio)</label>
        <input id="club" placeholder="Program / club you want" value={f.club} onChange={e=>setF({...f,club:e.target.value})} className="border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none rounded-lg w-full px-3 py-2 mt-1 text-sm bg-white" />
        <label htmlFor="message" className="block text-sm font-semibold text-teal-900 mt-3">Why do you want to join?</label>
        <textarea id="message" placeholder="One or two sentences is fine." required value={f.message} onChange={e=>setF({...f,message:e.target.value})} className="border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none rounded-lg w-full px-3 py-2 mt-1 text-sm bg-white" rows={4} />
        <div id="tour" className="mt-4 border border-teal-100 bg-teal-50/50 rounded-xl p-3">
          <h2 className="font-bold text-teal-900">Schedule a Tour</h2>
          <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={f.tour} onChange={e=>setF({...f,tour:e.target.checked})} className="accent-teal-700 h-4 w-4" /> I want a campus tour</label>
        </div>
        <button className="btn-pop bg-teal-700 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded-full mt-4">Send application</button>
      </form>
    </div>
  );
}
