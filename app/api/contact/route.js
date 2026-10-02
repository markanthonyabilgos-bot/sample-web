import { NextResponse } from "next/server"; import { getContacts, addContactDB, delContactDB, uid } from "@/lib/store";
export async function GET() { return NextResponse.json({ contacts: await getContacts() }); }
export async function POST(req) { const body = await req.json(); if (!body.name || !body.message) return NextResponse.json({ error: "Name and message required" }, { status: 400 }); const c = { id: uid("c"), at: new Date().toISOString(), ...body }; return NextResponse.json(await addContactDB(c)); }
export async function DELETE(req) { const { searchParams } = new URL(req.url); await delContactDB(searchParams.get("id")); return NextResponse.json({ ok: true }); }
