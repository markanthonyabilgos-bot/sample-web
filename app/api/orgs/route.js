import { NextResponse } from "next/server"; import { getOrgs, addOrgDB, updateOrgDB, delOrgDB, uid } from "@/lib/store";
export async function GET() { return NextResponse.json({ orgs: await getOrgs() }); }
export async function POST(req) { const body = await req.json().catch(() => ({})); if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 }); const o = { id: uid("org"), members: 0, advisor: "", day: "", desc: "", ...body }; return NextResponse.json(await addOrgDB(o)); }
export async function PUT(req) { const body = await req.json().catch(() => ({})); if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 }); const { id, ...patch } = body; return NextResponse.json(await updateOrgDB(id, patch)); }
export async function DELETE(req) { const { searchParams } = new URL(req.url); await delOrgDB(searchParams.get("id")); return NextResponse.json({ ok: true }); }
