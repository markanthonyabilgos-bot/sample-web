import { NextResponse } from "next/server";
import { getReactions, toggleReactionDB } from "@/lib/store";
export async function GET() {
  return NextResponse.json({ reactions: await getReactions() });
}
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  if (!body.target || !body.emoji) return NextResponse.json({ error: "target + emoji required" }, { status: 400 });
  return NextResponse.json(await toggleReactionDB(body.target, body.emoji, body.name || "anon"));
}
