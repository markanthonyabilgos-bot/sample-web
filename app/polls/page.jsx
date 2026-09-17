"use client";
import PollWidget from "@/components/poll";
export default function PollsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-teal-950">Polls</h1>
      <p className="text-sm text-slate-600 mt-1">Vote — results update live. New polls appear here when admins post them.</p>
      <PollWidget />
    </div>
  );
}
