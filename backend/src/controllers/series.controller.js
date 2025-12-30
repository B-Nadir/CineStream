import redis from "../config/redis.js";
import { getSeries } from "../services/series.service.js";

const TTL = 3600;

export async function listSeries(req, res) {
  const cacheKey = `series:${JSON.stringify(req.query)}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ cached: true, data: JSON.parse(cached) });
    }

    const data = await getSeries(req.query);
    await redis.setex(cacheKey, TTL, JSON.stringify(data));

    res.json({ cached: false, data });
  } catch (err) {
    console.error("series:list error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
