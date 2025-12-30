import Redis from "ioredis";
import { env } from "./env.js";

const redis = new Redis({
  host: env.redis.host,
  port: env.redis.port,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

export default redis;
