import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getMovieDetail, getSeriesDetail, getWatchlist, addToWatchlist, removeFromWatchlist, getToken } from "../services/api";

import netflix from "../assets/ott/netflix.png";
import prime from "../assets/ott/prime.png";
import hotstar from "../assets/ott/hotstar.png";
import zee5 from "../assets/ott/zee.png";
import sonyliv from "../assets/ott/sonyliv.png";

const OTT_PLATFORMS = [
  { name: "Netflix", logo: netflix },
  { name: "Amazon Prime Video", logo: prime, keywords: ["prime", "amazon"] },
  { name: "Jio Hotstar", logo: hotstar },
  { name: "Zee5", logo: zee5 },
  { name: "Sony Liv", logo: sonyliv },
];

export default function Detail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [error, setError] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const isMovie = location.pathname.startsWith("/movies");
    const fetcher = isMovie ? getMovieDetail : getSeriesDetail;

    fetcher(id)
      .then(async (data) => {
        setShow({
          ...data,
          show_type: location.pathname.startsWith("/movies") ? "movie" : "series"
        });

        // Check watchlist status
        try {
          const response = await getWatchlist();
          const list = Array.isArray(response) ? response : 
                       Array.isArray(response.data) ? response.data : [];
          setInWatchlist(list.some(item => String(item.id) === String(data.id)));
        } catch (err) {
          console.error("Failed to check watchlist status", err);
        }
      })
      .catch(err => setError(err.message));
  }, [id, location.pathname]);

  const toggleWatchlist = async () => {
    if (watchlistLoading) return;

    if (!getToken()) {
      navigate("/login");
      return;
    }

    setWatchlistLoading(true);

    try {
      const isMovie = location.pathname.startsWith("/movies");
      const type = isMovie ? "movie" : "series";
      if (inWatchlist) {
        await removeFromWatchlist(id, type);
        setInWatchlist(false);
      } else {
        await addToWatchlist({show_id: id, show_type: type});
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
      alert("Failed to update watchlist. Please try again.");
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (error) {
    return <div style={{ padding: 40, textAlign: "center", color: "#ff4d4d" }}>{error}</div>;
  }

  if (!show) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>;
  }

  const poster =
    show.images_json?.verticalPoster?.w720 ||
    show.images_json?.verticalPoster?.w600 ||
    show.images_json?.verticalPoster?.w480 ||
    show.images_json?.poster?.w500 || // Fallback
    "";

  // Try to find a horizontal backdrop image, fallback to poster if not found
  const backdrop = 
    show.images_json?.horizontalPoster?.w1440 ||
    show.images_json?.horizontalPoster?.w1080 ||
    show.images_json?.horizontalPoster?.w720 ||
    show.images_json?.horizontalBackdrop?.w1440 ||
    show.images_json?.horizontalBackdrop?.w1080 ||
    poster;

  // Deduplicate genres
  const genres = show.genres ? [...new Set(show.genres)] : [];

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", color: "white" }}>
      {/* Blurred Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.3)",
          zIndex: -1,
        }}
      />

      {/* Centered Content */}
      <div className="details-container" style={{ 
        maxWidth: "1000px", 
        margin: "0 auto", 
        padding: "40px 20px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        textAlign: "center",
        position: "relative",
        zIndex: 1
      }}>
        {poster && (
          <img
            src={poster}
            alt={show.title}
            style={{ 
              width: "300px", 
              borderRadius: "20px", 
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              marginBottom: "32px"
            }}
          />
        )}

        <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "16px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
          {show.title}
        </h1>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px", fontSize: "1.1rem", color: "#e0e0e0" }}>
          <span>{show.release_year || "N/A"}</span>
          <span>•</span>
          <span>⭐ {show.rating ? show.rating: "N/A"}</span>
        </div>

        {genres.length > 0 && (
          <div style={{ marginBottom: "32px", display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            {genres.map(g => (
              <span key={g} style={{ 
                padding: "6px 16px", 
                background: "rgba(255,255,255,0.1)", 
                borderRadius: "20px", 
                fontSize: "0.9rem",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                {g}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginBottom: "40px" }}>
          <button 
            className={`watchlist-hero-btn ${inWatchlist ? "in-list" : ""} ${watchlistLoading ? "loading" : ""}`}
            onClick={toggleWatchlist}
            disabled={watchlistLoading}
          >
            <span style={{ fontSize: "1.4rem" }}>{inWatchlist ? "✓" : "+"}</span>
            {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          </button>
        </div>

      {show.overview && (
        <div style={{ maxWidth: "800px", marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "16px", fontSize: "1.5rem" }}>Overview</h3>
          <p style={{ lineHeight: "1.8", fontSize: "1.1rem", color: "#d0d0d0" }}>{show.overview}</p>
        </div>
      )}

        <div style={{ width: "100%", maxWidth: "800px" }}>
          <h3 style={{ marginBottom: "24px", fontSize: "1.5rem" }}>Available On</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center" }}>
            {OTT_PLATFORMS.map((provider) => {
              const available = show.platforms?.find((p) => {
                const pName = p.platform.toLowerCase();
                const nameMatch = pName.includes(provider.name.toLowerCase());
                const keywordMatch = provider.keywords?.some((k) => pName.includes(k));
                return nameMatch || keywordMatch;
              });

              const style = {
                width: "64px",
                height: "64px",
                objectFit: "contain",
                borderRadius: "12px",
                filter: available ? "none" : "grayscale(100%) brightness(0.4)",
                opacity: available ? 1 : 0.5,
                transition: "transform 0.2s, filter 0.2s",
                cursor: available ? "pointer" : "not-allowed",
              };

              if (available) {
                return (
                  <a key={provider.name} href={available.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      style={style}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </a>
                );
              }
              return (
                <img
                  key={provider.name}
                  src={provider.logo}
                  alt={provider.name}
                  style={style}
                  title={`${provider.name} (Not Available)`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
   