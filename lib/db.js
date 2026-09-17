import fs from "fs"; import path from "path";
export function readDB() { const p = path.join(process.cwd(), "data", "db.json"); return JSON.parse(fs.readFileSync(p, "utf8")); }
export function writeDB(db) { try { const p = path.join(process.cwd(), "data", "db.json"); fs.writeFileSync(p, JSON.stringify(db, null, 2)); } catch { /* Vercel read-only: RSVPs kept in memory only */ } }
