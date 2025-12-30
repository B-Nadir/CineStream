import db from "../config/db.js";

export async function getTopByPlatform(platform) {
  const [rows] = await db.execute(
    `
    SELECT
      s.id,
      s.title,
      s.show_type,
      s.release_year,
      s.rating,
      s.images_json,
      MIN(ss.platform) AS platform,
      MIN(ss.link) AS link
    FROM shows s
    JOIN show_streaming ss ON ss.show_id = s.id
    WHERE ss.platform = ?
    GROUP BY s.id
    ORDER BY s.rating DESC
    LIMIT 10
    `,
    [platform]
  );

  return rows;
}

export async function getTopAll() {
  const [rows] = await db.execute(
    `
    SELECT
      s.id,
      s.title,
      s.show_type,
      s.release_year,
      s.rating,
      s.images_json,
      MIN(ss.platform) AS platform,
      MIN(ss.link) AS link
    FROM shows s
    JOIN show_streaming ss ON ss.show_id = s.id
    GROUP BY s.id
    ORDER BY s.rating DESC
    LIMIT 20
    `
  );

  return rows;
}
