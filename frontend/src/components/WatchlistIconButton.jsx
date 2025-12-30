import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToWatchlist,
  removeFromWatchlist,
  getToken,
} from "../services/api";
import "../cinestream.css";
import "../mobile.css";

export default function WatchlistIconButton({ show }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(!!show.is_saved);
  const [loading, setLoading] = useState(false);

  // Sync with backend truth
  useEffect(() => {
    if (typeof show.is_saved === "boolean") {
      setSaved(show.is_saved);
    }
  }, [show.is_saved]);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation(); // 🔑 prevent card click

    if (!getToken()) {
      navigate("/login");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (saved) {
        await removeFromWatchlist(show.id, show.show_type);
        setSaved(false);
      } else {
        await addToWatchlist({
          show_id: show.id,
          show_type: show.show_type,
        });
        setSaved(true);
      }
    } catch (err) {
      console.error("Watchlist toggle failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`watchlist-icon-btn ${saved ? "saved" : ""}`}
      onClick={toggle}
      disabled={loading}
      title={saved ? "Remove from watchlist" : "Add to watchlist"}
    >
      {saved ? "✔" : "＋"}
    </button>
  );
}
