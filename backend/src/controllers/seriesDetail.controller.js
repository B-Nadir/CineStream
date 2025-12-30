import { getSeriesDetail } from "../services/seriesDetail.service.js";

export async function seriesDetail(req, res) {
  const { id } = req.params;

  const data = await getSeriesDetail(id);
  if (!data) {
    return res.status(404).json({ error: "Series not found" });
  }

  res.json(data);
}
