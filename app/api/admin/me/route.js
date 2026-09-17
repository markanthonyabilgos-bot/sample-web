import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.cookies.get("admin_session")?.value;
  // Verify against expected token (HMAC) via the same rule as lib/auth
  const { isAdminToken } = await import("@/lib/auth");
  return NextResponse.json({ admin: isAdminToken(token) });
}