"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto px-4 py-16 text-sm">Loading…</div>}>
      <Login />
    </Suspense>
  );
}
function Login() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) router.push(next);
    else setErr("Wrong password. Ask Ms. Rivera for the admin password.");
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-teal-950">Admin login</h1>
      <p className="text-sm text-slate-600 mt-1">Teachers only. This area lets you edit events & news.</p>
      <form onSubmit={submit} className="mt-4 space-y-2">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="border border-teal-200 rounded-lg w-full px-3 py-2 text-sm"
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-pop bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-semibold w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
