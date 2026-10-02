"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SiteSearch from "@/components/search";

const prospective = [
  ["/organizations", "Programs"],
  ["/contact", "Admissions"],
  ["/contact#tour", "Schedule a Tour"],
];
const campus = [
  ["/announcements", "News"],
  ["/events", "Events"],
  ["/organizations", "Staff & Clubs"],
  ["/gallery", "Gallery"],
  ["/archive", "Resources"],
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [segment, setSegment] = useState("prospective");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  const links = segment === "prospective" ? prospective : campus;
  return (
    <nav aria-label="Primary" className="sticky top-0 z-50 bg-pine text-white shadow-lg shadow-teal-900/30 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-mint" onClick={() => setOpen(false)}>
          <Image src="/logo/cebutech-alpha.jpg" alt="CebuTech Alpha Designers badge – CTU Main Campus" width={36} height={36} className="rounded-full object-cover" priority />
          <span>Cebutech Alpha <span className="text-aqua">Designers</span></span>
        </Link>
        <div className="hidden md:flex gap-4 text-sm items-center">
          <div role="tablist" aria-label="Audience" className="flex rounded-full border border-white/20 p-0.5 text-xs">
            <button role="tab" aria-selected={segment === "prospective"} onClick={() => setSegment("prospective")} className={segment === "prospective" ? "bg-white text-pine px-3 py-1 rounded-full font-semibold" : "px-3 py-1 text-white/70 hover:text-white"}>Prospective</button>
            <button role="tab" aria-selected={segment === "campus"} onClick={() => setSegment("campus")} className={segment === "campus" ? "bg-white text-pine px-3 py-1 rounded-full font-semibold" : "px-3 py-1 text-white/70 hover:text-white"}>Campus</button>
          </div>
          {links.map(([href, label]) => <Link key={href + label} className="nav-link rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-mint" href={href}>{label}</Link>)}
          <SiteSearch />
          <button onClick={toggleTheme} className="border border-white/30 rounded-full px-2 py-0.5 text-xs hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint" title="Toggle dark mode" aria-label="Toggle dark mode">{dark ? "☀️" : "🌙"}</button>
          <Link href="/contact" className="btn-pop bg-white text-pine px-3 py-1 rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-mint">Apply Now</Link>
        </div>
        <div className="flex md:hidden gap-2 items-center">
          <button onClick={toggleTheme} className="border border-white/30 rounded-full px-2 py-0.5 text-xs" aria-label="Toggle dark mode">{dark ? "☀️" : "🌙"}</button>
          <button onClick={() => setOpen(!open)} className="border border-white/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-mint" aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu">{open ? "✕" : "☰"}</button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1 text-sm bg-pine">
          <div className="py-1"><SiteSearch /></div>
          <div role="tablist" aria-label="Audience" className="flex gap-2 my-2">
            <button role="tab" aria-selected={segment === "prospective"} onClick={() => setSegment("prospective")} className={segment === "prospective" ? "bg-white text-pine px-3 py-1 rounded-full font-semibold text-xs" : "border border-white/20 px-3 py-1 rounded-full text-xs"}>Prospective</button>
            <button role="tab" aria-selected={segment === "campus"} onClick={() => setSegment("campus")} className={segment === "campus" ? "bg-white text-pine px-3 py-1 rounded-full font-semibold text-xs" : "border border-white/20 px-3 py-1 rounded-full text-xs"}>Campus & Staff</button>
          </div>
          <p className="text-[11px] uppercase tracking-wide text-white/50 mt-1">{segment === "prospective" ? "Prospective students" : "Students & staff"}</p>
          {[...links, ["/contact", "Apply Now"]].map(([href, label]) => (
            <Link key={href + label} href={href} onClick={() => setOpen(false)} className="py-2 border-b border-white/5 last:border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded">{label}</Link>
          ))}
          <Link href="/admin" onClick={() => setOpen(false)} className="py-2 text-white/50 text-xs">Admin</Link>
        </div>
      )}
    </nav>
  );
}
