import { Link } from "react-router-dom";
import WatchlistIconButton from "./WatchlistIconButton";
import "../cinestream.css";
import "../mobile.css";

export default function ShowCard({ show }) {
  if (!show) return null;

  const {
    id,
    title,
    show_type,
    release_year,
    rating,
    images_json,
  } = show;

  const poster =
    images_json?.verticalPoster?.w240 ||
    images_json?.poster?.w240 ||
    "";

  const detailPath =
    show_type === "movie" ? `/movies/${id}` : `/series/${id}`;

  return (
    <div className="cinematic-card" style={{ position: "relative" }}>
      {/* ✅ ICON BUTTON — OUTSIDE LINK */}
      <WatchlistIconButton show={show} />

      {/* ✅ CARD NAVIGATION */}
      <Link to={detailPath}>
        <div className="poster-wrapper">
          {poster ? (
            <img src={poster} alt={title} loading="lazy" />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#222",
              }}
            />
          )}

          <div className="card-overlay">
            <h4 className="card-title">{title}</h4>

            <div className="card-meta">
              <span>{release_year || "—"}</span>
              <span>⭐ {rating ? rating : "—"}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
