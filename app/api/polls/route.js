import { NextResponse } from "next/server";
import { getPolls, addPollDB, delPollDB, votePollDB, getPollVotes, uid } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const polls = await getPolls();
  if (id) {
    const poll = polls.find((p) => p.id === id);
    const votes = await getPollVotes(id);
    return NextResponse.json({ poll, votes });
  }
  return NextResponse.json({ polls });
}
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  if (body.vote) {
    if (!body.poll_id || !body.option) return NextResponse.json({ error: "poll_id + option required" }, { status: 400 });
    return NextResponse.json(await votePollDB(body.poll_id, body.option));
  }
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!body.question || !body.options?.length) return NextResponse.json({ error: "question + options required" }, { status: 400 });
  const p = { id: uid("p"), created_at: new Date().toISOString(), active: true, ...body };
  return NextResponse.json(await addPollDB(p));
}
export async function DELETE(req) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  await delPollDB(searchParams.get("id"));
  return NextResponse.json({ ok: true });
}
