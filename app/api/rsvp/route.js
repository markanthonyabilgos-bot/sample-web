import { NextResponse } from "next/server"; import { getRsvps, addRsvpDB, delRsvpDB, uid } from "@/lib/store";
export async function GET() { return NextResponse.json({ rsvps: await getRsvps() }); }
export async function POST(req) { const body = await req.json(); if (!body.name || !body.eventId) return NextResponse.json({ error: "Name and event required" }, { status: 400 }); const r = { id: uid("r"), at: new Date().toISOString(), ...body }; return NextResponse.json(await addRsvpDB(r)); }
export async function DELETE(req) { const { searchParams } = new URL(req.url); await delRsvpDB(searchParams.get("id")); return NextResponse.json({ ok: true }); }
