import { getMovieDetail } from "../services/movieDetail.service.js";

export async function movieDetail(req, res) {
  const { id } = req.params;

  const data = await getMovieDetail(id);
  if (!data) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.json(data);
}
