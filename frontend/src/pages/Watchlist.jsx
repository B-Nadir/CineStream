import { useEffect, useState } from "react";
import { getWatchlist } from "../services/api";
import ShowCard from "../components/ShowCard";
import "../cinestream.css";
import "../mobile.css";

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getWatchlist()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title" style={{ textAlign: "center" }}>
        My Watchlist
      </h1>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          Your watchlist is empty.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "16px"
        }}
      >
        {items.map((show) => (
          <ShowCard
            key={`${show.show_type}-${show.id}`}
            show={{ ...show, is_saved: true }}
          />
        ))}
      </div>
    </div>
  );
}
