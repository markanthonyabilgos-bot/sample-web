import { NextResponse } from "next/server"; import { getEvents, addEventDB, updateEventDB, delEventDB, uid } from "@/lib/store";
export async function GET() { return NextResponse.json({ events: await getEvents() }); }
export async function POST(req) { const body = await req.json().catch(() => ({})); if (!body.title || !body.date) return NextResponse.json({ error: "Title and date required" }, { status: 400 }); const ev = { id: uid("e"), org: "Admin", description: "", place: "", ...body }; return NextResponse.json(await addEventDB(ev)); }
export async function PUT(req) { const body = await req.json().catch(() => ({})); if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 }); const { id, ...patch } = body; return NextResponse.json(await updateEventDB(id, patch)); }
export async function DELETE(req) { const { searchParams } = new URL(req.url); await delEventDB(searchParams.get("id")); return NextResponse.json({ ok: true }); }
