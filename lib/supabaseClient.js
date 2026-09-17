import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Browser client (realtime subscriptions). Returns null if env missing -> callers fallback to /api fetch.
export function getBrowserSupabase() {
  if (!url || !anon) return null;
  return createClient(url, anon);
}
