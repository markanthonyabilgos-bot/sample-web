import crypto from "crypto";

export function expectedAdminToken() {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw) return null;
  return crypto.createHmac("sha256", pw).update("admin-ok").digest("hex");
}

export function isAdminToken(token) {
  const expected = expectedAdminToken();
  if (!expected || !token) return false;
  try {
    const a = Buffer.from(token, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return token === expected;
  }
}

export function isAdminRequest(req) {
  // Next.js Route Handler: req.cookies.get("admin_session")?.value
  try {
    const token = req.cookies?.get?.("admin_session")?.value;
    return isAdminToken(token);
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE = "admin_session";
