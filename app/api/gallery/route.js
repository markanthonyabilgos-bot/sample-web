import { NextResponse } from "next/server";
import { getGallery, addGalleryDB, delGalleryDB, uid } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ gallery: await getGallery() });
}
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    if (!body.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
    const item = { id: uid("g"), created_at: new Date().toISOString(), image: "", caption: "", ...body };
    return NextResponse.json(await addGalleryDB(item));
  } catch (err) { return NextResponse.json({ error: err.message || "Save failed" }, { status: 500 }); }
}
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    await delGalleryDB(searchParams.get("id"));
    return NextResponse.json({ ok: true });
  } catch (err) { return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 }); }
}
