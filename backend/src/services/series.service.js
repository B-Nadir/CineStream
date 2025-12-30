import db from "../config/db.js";

export async function getSeries(filters) {
  const conditions = [`s.show_type = 'series'`];
  const params = [];

  if (filters.platform) {
    conditions.push("ss.platform = ?");
    params.push(filters.platform);
  }

  if (filters.genre) {
    conditions.push("g.name = ?");
    params.push(filters.genre);
  }

  if (filters.minRating) {
    conditions.push("s.rating >= ?");
    params.push(filters.minRating);
  }

  if (filters.year) {
    conditions.push("s.release_year = ?");
    params.push(filters.year);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const [rows] = await db.execute(
    `
    SELECT
      s.id,
      s.show_type,
      s.title,
      s.release_year,
      s.rating,
      s.images_json,
      MIN(ss.platform) AS platform
    FROM shows s
    JOIN show_streaming ss ON ss.show_id = s.id
    LEFT JOIN show_genres sg ON sg.show_id = s.id
    LEFT JOIN genres g ON g.id = sg.genre_id
    ${whereClause}
    GROUP BY s.id
    ORDER BY s.rating DESC
    `,
    params
  );

  return rows;
}
