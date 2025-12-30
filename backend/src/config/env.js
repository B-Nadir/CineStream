import dotenv from "dotenv";
dotenv.config();

const required = [
  "PORT",
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_PORT",
  "REDIS_HOST",
  "REDIS_PORT",
  "RAPID_API_KEY",
  "RAPID_API_HOST",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing env variable: ${key}`);
  }
}

export const env = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  rapid: {
    key: process.env.RAPID_API_KEY,
    host: process.env.RAPID_API_HOST,
  },
};
