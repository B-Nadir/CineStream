import db from "../config/db.js";

export async function getMovieDetail(id) {
  const [[movie]] = await db.execute(
    `
    SELECT
      s.id,
      s.title,
      s.release_year,
      s.rating,
      s.overview,
      s.images_json
    FROM shows s
    WHERE s.id = ? AND s.show_type = 'movie'
    `,
    [id]
  );

  if (!movie) return null;

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
    ...movie,
    images_json: typeof movie.images_json === 'string' ? JSON.parse(movie.images_json) : movie.images_json,
    genres: genres.map((g) => g.name),
    platforms,
  };
}
