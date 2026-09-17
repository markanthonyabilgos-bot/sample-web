"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CountUp, Reveal, Tilt, Typing } from "@/components/fx";
import Spotlight from "@/components/spotlight";
import PollWidget from "@/components/poll";
import Leaderboard from "@/components/leaderboard";
export default function Home() {
  const [stats, setStats] = useState({ orgs: 6, members: 480, events: 8 });
  const [pinned, setPinned] = useState(null);
  useEffect(() => {
    fetch("/api/orgs").then((r) => r.json()).then((d) => {
      if (d.orgs) setStats((s) => ({ ...s, orgs: d.orgs.length, members: d.orgs.reduce((a, o) => a + (Number(o.members) || 0), 0) || s.members }));
    }).catch(() => {});
    fetch("/api/events").then((r) => r.json()).then((d) => {
      if (d.events) setStats((s) => ({ ...s, events: d.events.length }));
    }).catch(() => {});
    fetch("/api/announcements").then((r) => r.json()).then((d) => {
      const list = d.announcements || [];
      setPinned(list.find((a) => a.pinned) || list[0] || null);
    }).catch(() => {});
  }, []);
  return (<div>
    {pinned && (
      <div className="bg-amber-50 border-b border-amber-200 text-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2">
          <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-full">PINNED</span>
          <span className="truncate"><b>{pinned.title}</b> — {pinned.body}</span>
          <Link href="/announcements" className="ml-auto underline shrink-0">Read more</Link>
        </div>
      </div>
    )}
    <section className="teal-hero text-white py-16">
      <div className="hero-blob w-72 h-72 bg-teal-300 -top-10 -left-10" />
      <div className="hero-blob w-96 h-96 bg-emerald-400 top-20 right-0" style={{ animationDelay: "-4s" }} />
      <div className="hero-blob w-64 h-64 bg-yellow-200 bottom-0 left-1/3" style={{ animationDelay: "-7s" }} />
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <p className="text-gold text-sm font-semibold tracking-wide">OFFICE OF STUDENT LIFE — EST. 1998</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 leading-tight">Find your crew.<br/>Build something real.</h1>
        <p className="mt-3 text-xl text-teal-100 h-8"><Typing words={["Robotics…", "Debate…", "Art…", "Music…", "Eco Warriors…"]} /></p>
        <p className="mt-2 text-white/80">28 active clubs at My School — robotics on Tuesdays, debate on Thursdays, weekend clean-ups at Riverside Park. No tryout stress, just show up twice and you&apos;re in.</p>
        <div className="mt-6 flex gap-3"><Link href="/organizations" className="btn-pop bg-gold text-navy px-5 py-2 rounded-full font-semibold">Browse clubs</Link><Link href="/events" className="btn-pop border border-white/40 px-5 py-2 rounded-full hover:bg-white/10">This week</Link></div>
        <div className="mt-8 flex gap-8 text-sm"><div><b className="text-2xl"><CountUp to={stats.orgs} /></b><br/>active orgs</div><div><b className="text-2xl"><CountUp to={stats.members} suffix="+" /></b><br/>members</div><div><b className="text-2xl"><CountUp to={stats.events} /></b><br/>events / term</div></div>
      </motion.div>
      <div className="float-soft bg-white/95 text-navy rounded-xl p-6 shadow-lg border border-teal-100"><h3 className="font-bold">This week at My School</h3><ul className="mt-3 space-y-2 text-sm"><li>• Tue 3:30pm — Robotics open build, Lab 3</li><li>• Thu 4pm — Debate tryouts, Room 112</li><li>• Sat 8am — Park clean-up, meet at gate</li></ul><p className="mt-4 text-xs text-slate-500">Posted by Ms. Rivera, Activities Coordinator</p></div>
    </div></section>
    <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
      {[["Robotics Team","42 members — built a line-follower that placed 2nd at regionals."],["Debate Society","31 members — novice-friendly, Thursday sparring."],["Art & Mural Club","Painted the east hallway mural last spring."]].map(([t,d], i)=>(
        <Reveal key={t} delay={i * 0.08}><Tilt className="card-lift border border-teal-100 bg-white rounded-xl p-5 hover:shadow-md transition"><h3 className="font-bold text-teal-900">{t}</h3><p className="text-sm mt-2 text-slate-600">{d}</p></Tilt></Reveal>))}
    </section>
    <Spotlight />
    <Leaderboard />
    <div className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-2 gap-4">
      <PollWidget />
      <Reveal delay={0.1}>
        <div className="border border-teal-100 bg-white rounded-xl p-5">
          <p className="text-xs font-bold text-teal-600 tracking-wide">ADVISERS</p>
          <h3 className="font-bold text-teal-900 mt-1">Find your adviser</h3>
          <p className="text-sm text-slate-600 mt-1">Robotics — Mr. Chen (Lab 3) · Debate — Ms. Okafor (Room 112) · Art — Ms. Rivera (Art Room) · Music — Mr. Santos (Hall A) · Eco — Ms. Dela Cruz (Gate)</p>
          <Link href="/organizations" className="text-sm text-teal-700 underline">See all clubs</Link>
        </div>
      </Reveal>
    </div>
  </div>);
}

