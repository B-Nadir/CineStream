import db from "../config/db.js";

export async function getSeriesDetail(id) {
  const [[series]] = await db.execute(
    `
    SELECT
      s.id,
      s.title,
      s.release_year,
      s.rating,
      s.overview,
      s.images_json
    FROM shows s
    WHERE s.id = ? AND s.show_type = 'series'
    `,
    [id]
  );

  if (!series) return null;

  const [genres] = await db.execute(
    `
    SELECT g.name
    FROM genres g
    JOIN show_genres sg ON sg.genre_id = g.id
    WHERE sg.show_id = ?
    `,
    [id]
  );

  const [platforms] = await db.execute(
    `
    SELECT platform, link
    FROM show_streaming
    WHERE show_id = ?
    `,
    [id]
  );

  return {
    ...series,
    images_json: typeof series.images_json === 'string' ? JSON.parse(series.images_json) : series.images_json,
    genres: genres.map((g) => g.name),
    platforms,
  };
}
