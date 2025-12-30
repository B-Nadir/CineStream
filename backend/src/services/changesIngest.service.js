import axios from "axios";
import db from "../config/db.js";
import redis from "../config/redis.js";

const RAPID_API_KEY = process.env.RAPIDAPI_KEY;
const RAPID_API_HOST = "streaming-availability.p.rapidapi.com";

export async function runChangesIngestion() {
  console.log("🔄 Starting changes ingestion");

  // 1️⃣ Read last sync time
  const [[state]] = await db.execute(
    "SELECT last_changes_sync FROM ingestion_state WHERE id = 1"
  );

  const since = state.last_changes_sync.toISOString();
  console.log("⏱️ Syncing changes since:", since);

  // 2️⃣ Call RapidAPI changes endpoint
  const res = await axios.get(
    "https://streaming-availability.p.rapidapi.com/changes",
    {
      params: {
        country: "in",
        since
      },
      headers: {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": RAPID_API_HOST
      }
    }
  );

  const changes = res.data?.results || [];
  console.log(`📦 ${changes.length} changes received`);

  let added = 0;
  let updated = 0;

  for (const item of changes) {
    const exists = await showExists(item);

    if (!exists) {
      await ingestNewShow(item);
      added++;
    } else {
      await updateExistingShow(item);
      updated++;
    }
  }

  // 3️⃣ Update sync timestamp
  await db.execute(
    "UPDATE ingestion_state SET last_changes_sync = NOW() WHERE id = 1"
  );

  // 4️⃣ Clear Redis cache
  await redis.flushall();

  console.log(`✅ Changes done | Added: ${added}, Updated: ${updated}`);

  return { added, updated };
}

/* ---------------- HELPERS ---------------- */

async function showExists(item) {
  const [rows] = await db.execute(
    "SELECT id FROM shows WHERE tmdb_id = ?",
    [item.tmdbId]
  );
  return rows.length > 0;
}

async function ingestNewShow(item) {
  // Placeholder: you already have ingestion logic elsewhere
  console.log("➕ New show:", item.title);
}

async function updateExistingShow(item) {
  // Placeholder: update availability / metadata only
  console.log("♻️ Updated show:", item.title);
}
