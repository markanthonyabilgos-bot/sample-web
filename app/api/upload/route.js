import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { uid, addGalleryDB } from "@/lib/store";

export async function POST(req) {
  try {
    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: "No file" }, { status: 400 });
    const file = form.get("file");
    const title = String(form.get("title") || "Photo");
    const caption = String(form.get("caption") || "");
    if (!file || typeof file === "string") return NextResponse.json({ error: "No file" }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Max 4MB" }, { status: 400 });

    const sb = getServerSupabase();
    const ext = (file.name || "jpg").split(".").pop().toLowerCase().slice(0, 4);
    const key = "gallery/" + uid("img") + "." + ext;

    // Prefer Supabase Storage bucket "photos" (public). Falls back to data-URL in db.json.
    if (sb && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const buf = Buffer.from(await file.arrayBuffer());
      const { error } = await sb.storage.from("photos").upload(key, buf, { contentType: file.type || "image/jpeg", upsert: true });
      if (!error) {
        const { data } = sb.storage.from("photos").getPublicUrl(key);
        const item = await addGalleryDB({ id: uid("g"), title, caption, image: data.publicUrl, created_at: new Date().toISOString() });
        return NextResponse.json(item);
      }
    }
    // Fallback: store as data URL (works locally, small images only)
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUrl = "data:" + (file.type || "image/jpeg") + ";base64," + buf.toString("base64");
    if (dataUrl.length > 900000) return NextResponse.json({ error: "Image too big for local storage — set up Supabase Storage 'photos' bucket" }, { status: 413 });
    const item = await addGalleryDB({ id: uid("g"), title, caption, image: dataUrl, created_at: new Date().toISOString() });
    return NextResponse.json(item);
  } catch (err) { return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 }); }
}
