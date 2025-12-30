import { runChangesIngestion } from "../services/changesIngest.service.js";

export async function runChanges(req, res) {
  try {
    const result = await runChangesIngestion();
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error("Changes ingestion failed:", err);
    res.status(500).json({ error: "Changes ingestion failed" });
  }
}
