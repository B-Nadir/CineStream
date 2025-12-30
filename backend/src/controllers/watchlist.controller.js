import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from "../services/watchlist.service.js";

export async function listWatchlist(req, res) {
  try {
    const data = await getWatchlist(req.user.id);
    res.json(data);
  } catch (err) {
    console.error("List watchlist error:", err);
    res.status(500).json({ error: "Failed to load watchlist" });
  }
}

export async function addItem(req, res) {
  try {
    const userId = req.user.id;
    const { show_id, show_type } = req.body;

    if (!show_id || !["movie", "series"].includes(show_type)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    await addToWatchlist(userId, show_id, show_type);
    res.status(201).json({ success: true });

  } catch (err) {
    console.error("Add watchlist error:", err);
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
}

export async function removeItem(req, res) {
  try {
    const userId = req.user.id;
    const { showId, type } = req.params;

    if (!showId || !["movie", "series"].includes(type)) {
      return res.status(400).json({ error: "Invalid params" });
    }

    await removeFromWatchlist(userId, showId, type);
    res.json({ success: true });

  } catch (err) {
    console.error("Remove watchlist error:", err);
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
}
