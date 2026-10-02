import { NextResponse } from "next/server";
import { addSubscriberDB, getSubscribers } from "@/lib/store";
export async function GET() {
  return NextResponse.json({ subscribers: await getSubscribers() });
}
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  if (!body.email || !body.email.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  return NextResponse.json(await addSubscriberDB(body.email.trim().toLowerCase()));
}
