"use client";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/fx";
export default function PollWidget({ compact = false }) {
  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState([]);
  const [picked, setPicked] = useState(null);
  const load = () => {
    fetch("/api/polls").then((r) => r.json()).then((d) => {
      const list = d.polls || [];
      const active = list.find((p) => p.active) || list[0];
      if (!active) return;
      setPoll(active);
      fetch("/api/polls?id=" + active.id).then((r) => r.json()).then((v) => setVotes(v.votes || []));
      setPicked(localStorage.getItem("poll_" + active.id));
    }).catch(() => {});
  };
  useEffect(() => { load(); }, []);
  async function vote(option) {
    if (picked) return;
    await fetch("/api/polls", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vote: true, poll_id: poll.id, option }) });
    localStorage.setItem("poll_" + poll.id, option);
    setPicked(option);
    const v = await fetch("/api/polls?id=" + poll.id).then((r) => r.json());
    setVotes(v.votes || []);
  }
  if (!poll) return null;
  const counts = {};
  votes.forEach((v) => { counts[v.option] = (counts[v.option] || 0) + 1; });
  const total = votes.length || 1;
  return (
    <Reveal>
      <div className={"border border-teal-100 bg-white rounded-xl p-5 " + (compact ? "" : "mt-6")}>
        <p className="text-xs font-bold text-teal-600 tracking-wide">POLL</p>
        <h3 className="font-bold text-teal-900 mt-1">{poll.question}</h3>
        <div className="mt-3 space-y-2">
          {poll.options.map((opt) => {
            const c = counts[opt] || 0;
            const pct = Math.round((c / total) * 100);
            return (
              <button key={opt} onClick={() => vote(opt)} disabled={!!picked} className="w-full text-left text-sm border border-teal-100 rounded-lg px-3 py-2 hover:border-teal-400 disabled:cursor-default relative overflow-hidden">
                <span className="absolute inset-y-0 left-0 bg-teal-100/70" style={{ width: (picked ? pct : 0) + "%" }} />
                <span className="relative flex justify-between"><span>{opt} {picked === opt && "✓"}</span>{picked && <b>{pct}% ({c})</b>}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-2">{votes.length} vote(s){picked ? " · thanks for voting!" : " · tap to vote"}</p>
      </div>
    </Reveal>
  );
}
