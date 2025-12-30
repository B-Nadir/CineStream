import XLSX from "xlsx";
import pool from "../src/config/db.js";
import redis from "../src/config/redis.js"; // ✅ ADD THIS
import path from "path";

const EXCEL_FILE = path.resolve("data/Ratings_tmdb_filled.xlsx");

/**
 * Normalizes rating values so that:
 * - null / undefined / empty → 0.0
 * - 0 → 0.0
 * - valid numbers → float with 1 decimal
 */
function normalizeRating(value) {
  if (value === undefined || value === null) return 0.0;

  if (typeof value === "string") {
    if (value.trim() === "") return 0.0;
    const num = Number(value);
    if (Number.isNaN(num)) return 0.0;
    return Number(num.toFixed(1));
  }

  if (typeof value === "number") {
    return Number(value.toFixed(1));
  }

  return 0.0;
}

async function run() {
  console.log("📖 Reading Excel...");

  const workbook = XLSX.readFile(EXCEL_FILE);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`📦 Found ${rows.length} rows`);

  let updated = 0;

  for (const row of rows) {
    if (!row.tmdb_id) continue;

    const rating = normalizeRating(row.ratings_new);

    const [result] = await pool.query(
      `
      UPDATE shows
      SET rating = ?
      WHERE tmdb_id = ?
      `,
      [rating, row.tmdb_id]
    );

    if (result.affectedRows > 0) {
      updated++;
    }
  }

  // 🔥 CRITICAL: invalidate all cached responses
  await redis.flushall();
  console.log("🧹 Redis cache cleared");

  console.log(`✅ Updated ${updated} rows in MySQL`);
  process.exit(0);
}

run();
