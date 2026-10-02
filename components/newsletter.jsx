"use client";
import { useState } from "react";
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  async function sub(e) {
    e.preventDefault();
    const r = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (r.ok) setDone(true);
    else alert("Please enter a valid email");
  }
  if (done) return <p className="text-sm text-teal-200">✓ You&apos;re subscribed! Watch your inbox for Friday roundups.</p>;
  return (
    <form onSubmit={sub} className="flex gap-2 mt-3">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email" required className="border border-white/30 bg-white/10 placeholder-white/50 rounded-full px-3 py-1.5 text-xs w-48 outline-none" />
      <button className="btn-pop bg-white text-pine px-3 py-1.5 rounded-full text-xs font-bold">Subscribe</button>
    </form>
  );
}
