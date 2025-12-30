import redis from "../config/redis.js";
import { getTopByPlatform } from "../services/home.service.js";

const CACHE_TTL = 60 * 60; // 1 hour

export async function topByPlatform(req, res) {
  const { platform } = req.params;
  const cacheKey = `home:top:${platform}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ cached: true, data: JSON.parse(cached) });
    }

    const data = await getTopByPlatform(platform);
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));

    res.json({ cached: false, data });
  } catch (err) {
    console.error("home:topByPlatform error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getHome(req, res) {
  const cacheKey = "home:dashboard";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const platforms = ["netflix", "prime", "hotstar", "sonyliv", "zee5"];
    const data = {};

    await Promise.all(
      platforms.map(async (p) => {
        data[p] = await getTopByPlatform(p);
      })
    );

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));

    res.json(data);
  } catch (err) {
    console.error("home:getHome error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
