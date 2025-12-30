import redis from "../config/redis.js";
import { getMovies } from "../services/movies.service.js";

const TTL = 3600;

export async function listMovies(req, res) {
  const cacheKey = `movies:${JSON.stringify(req.query)}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ cached: true, data: JSON.parse(cached) });
    }

    const data = await getMovies(req.query);
    await redis.setex(cacheKey, TTL, JSON.stringify(data));

    res.json({ cached: false, data });
  } catch (err) {
    console.error("movies:list error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
