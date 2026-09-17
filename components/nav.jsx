"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import SiteSearch from "@/components/search";
export default function SiteNav() {
  const [open, setOpen] = useState(false);
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
  const links = [["/organizations", "Clubs"], ["/events", "Events"], ["/announcements", "News"], ["/gallery", "Gallery"], ["/polls", "Polls"], ["/archive", "Archive"]];
  return (
    <nav className="sticky top-0 z-50 bg-navy text-white shadow-lg shadow-teal-900/30 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/" className="font-bold text-lg shrink-0" onClick={() => setOpen(false)}>My School <span className="text-gold">• Orgs</span></Link>
        <div className="hidden md:flex gap-4 text-sm items-center">
          {links.map(([href, label]) => <Link key={href} className="nav-link" href={href}>{label}</Link>)}
          <SiteSearch />
          <button onClick={toggleTheme} className="border border-white/30 rounded-full px-2 py-0.5 text-xs hover:bg-white/10" title="Toggle dark mode">{dark ? "☀️" : "🌙"}</button>
          <Link href="/contact" className="btn-pop bg-gold text-navy px-3 py-1 rounded-full font-semibold">Join Us</Link>
        </div>
        <div className="flex md:hidden gap-2 items-center">
          <button onClick={toggleTheme} className="border border-white/30 rounded-full px-2 py-0.5 text-xs">{dark ? "☀️" : "🌙"}</button>
          <button onClick={() => setOpen(!open)} className="border border-white/30 rounded-lg px-3 py-1 text-sm" aria-label="Menu">{open ? "✕" : "☰"}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1 text-sm bg-navy">
          <div className="py-1"><SiteSearch /></div>
          {[...links, ["/contact", "Join Us"]].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="py-2 border-b border-white/5 last:border-0">{label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}

