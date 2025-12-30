import app from "./app.js";
import "./config/db.js";
import "./config/redis.js";
import "./cron/changes.cron.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CineStream backend running on port ${PORT}`);
});
