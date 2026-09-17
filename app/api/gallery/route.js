import { NextResponse } from "next/server";
import { getGallery, addGalleryDB, delGalleryDB, uid } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ gallery: await getGallery() });
}
export async function POST(req) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const item = { id: uid("g"), created_at: new Date().toISOString(), image: "", caption: "", ...body };
  return NextResponse.json(await addGalleryDB(item));
}
export async function DELETE(req) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  await delGalleryDB(searchParams.get("id"));
  return NextResponse.json({ ok: true });
}
