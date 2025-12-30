import redis from "../config/redis.js";

export function cache(ttlSeconds) {
  return async (req, res, next) => {
    const key = `cinestream:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);
      res.json = async (data) => {
        await redis.setex(key, ttlSeconds, JSON.stringify(data));
        originalJson(data);
      };

      next();
    } catch (err) {
      console.error("Redis cache error", err);
      next();
    }
  };
}
