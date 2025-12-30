import cron from "node-cron";
import { runChangesIngestion } from "../services/changesIngest.service.js";

// Runs every Sunday at 03:00
cron.schedule("0 0 * * 0", async () => {
  console.log("🕒 Running weekly changes ingestion");
  await runChangesIngestion();
});
