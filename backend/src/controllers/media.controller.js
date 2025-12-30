import db from "../config/db.js";

export async function searchMedia(req, res) {
  try {
    const { query, type } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    if (!["movie", "series"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const [rows] = await db.execute(
      `
      SELECT
        s.id,
        s.show_type,
        s.title,
        s.release_year,
        s.rating,
        s.images_json
      FROM shows s
      WHERE s.show_type = ?
        AND MATCH(s.title, s.original_title)
            AGAINST (? IN BOOLEAN MODE)
      ORDER BY s.rating DESC
      LIMIT 100
      `,
      [type, `${query}*`]
    );

    res.json(
      rows.map(row => ({
        ...row,
        images_json:
          typeof row.images_json === "string"
            ? JSON.parse(row.images_json)
            : row.images_json,
      }))
    );
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
}
