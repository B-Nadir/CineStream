import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToWatchlist, removeFromWatchlist, getToken } from "../services/api";

export default function WatchlistButton({ show, onToggle }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSaved(Boolean(show.is_saved));
  }, [show.is_saved]);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();

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
        onToggle?.(false);
      } else {
        await addToWatchlist({
          show_id: show.id,
          show_type: show.show_type,
        });
        setSaved(true);
        onToggle?.(true);
      }
    } catch (err) {
      console.error("Watchlist error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="cinematic-button"
    >
      {saved ? "Remove" : "Add"}
    </button>
  );
}
