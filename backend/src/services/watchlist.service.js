import db from "../config/db.js";

export async function getWatchlist(userId) {
  const [rows] = await db.execute(`
    SELECT 
      w.show_id,
      w.show_type,
      s.title,
      s.release_year,
      s.rating,
      s.images_json
    FROM watchlist w
    JOIN shows s ON s.id = w.show_id
    WHERE w.user_id = ?
    ORDER BY w.id DESC
  `, [userId]);

  // Map back to frontend expected format
  return rows.map(row => ({
    id: row.show_id,
    show_type: row.show_type,
    title: row.title,
    release_year: row.release_year,
    rating: row.rating,
    images_json: typeof row.images_json === "string"
      ? JSON.parse(row.images_json)
      : row.images_json,
    is_saved: true
  }));

}

export async function addToWatchlist(userId, showId, showType) {
  await db.execute(
    `INSERT IGNORE INTO watchlist (user_id, show_id, show_type)
     VALUES (?, ?, ?)`,
    [userId, showId, showType]
  );
}

export async function removeFromWatchlist(userId, showId, showType) {
  await db.execute(
    `DELETE FROM watchlist
     WHERE user_id = ? AND show_id = ? AND show_type = ?`,
    [userId, showId, showType]
  );
}
