const { createClient } = require('redis');

let redisClient;

async function initRedis() {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379
    },
    password: process.env.REDIS_PASSWORD || undefined
  });

  redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

  await redisClient.connect();
  console.log('✔ Redis connected');
}

function getRedis() {
  if (!redisClient) throw new Error('Redis not initialized');
  return redisClient;
}

module.exports = { initRedis, getRedis };
