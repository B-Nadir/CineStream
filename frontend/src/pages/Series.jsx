import { useEffect, useState } from "react";
import { getSeries } from "../services/api";
import ShowCard from "../components/ShowCard";
import "../cinestream.css";
import "../mobile.css";
import bgImg from "../assets/bg.png";

const GENRES = [
"Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "News", "Reality", "Romance", "Science Fiction", "Talk Show", "Thriller", "War", "Western"];

// ✅ Sort helper: newest → oldest (by first air date)
const sortByReleaseYear = (list) => {
  return [...list].sort((a, b) => {
    const yearA = Number(a.release_year) || 0;
    const yearB = Number(b.release_year) || 0;
    return yearB - yearA;
  });
};

export default function Series() {
  const [series, setSeries] = useState([]);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [ratingBucket, setRatingBucket] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch series
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsFetching(true);

    const fetchSeries = async () => {
      try {
        let list = [];
        let total = 1;

        if (debouncedSearch) {
          // Search in local DB
          const res = await fetch(
            `http://localhost:5000/search?type=series&query=${encodeURIComponent(debouncedSearch)}`
          );

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.details || "Search failed");
          }

          list = await res.json();
          total = 1;
        } else {
          // Default listing
          const response = await getSeries({
            genre,
            rating: ratingBucket,
            page,
            limit: 100,
          });

          list =
            Array.isArray(response) ? response :
            Array.isArray(response.data) ? response.data :
            Array.isArray(response.series) ? response.series : [];

          total = response.total_pages || 1;
        }

        // ✅ Enforce release-year sorting
        const sorted = sortByReleaseYear(list);

        // Handle client-side pagination if needed
        if (sorted.length > 100) {
          total = Math.ceil(sorted.length / 100);
          const start = (page - 1) * 100;
          setSeries(sorted.slice(start, start + 100));
        } else {
          setSeries(sorted);
        }

        setTotalPages(total);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSeries();
  }, [debouncedSearch, genre, ratingBucket, page]);

  return (
    <div>
      {/* Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.6)",
          zIndex: -1,
        }}
      />

      <h1 className="page-title" style={{ textAlign: "center" }}>
        Series
      </h1>

      {/* Filters */}
      <div className="filter-bar glass-panel" style={{ padding: 16, borderRadius: 15 }}>
        <input
          className="search-input"
          placeholder="Search series..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination (Top) */}
      <div className="pagination">
        <button
          className="cinematic-button page-btn"
          disabled={page === 1 || isFetching}
          onClick={() => {
            setPage((p) => p - 1);
            window.scrollTo(0, 0);
          }}
        >
          Previous
        </button>

        <span style={{ alignSelf: "center", color: "var(--text-secondary)" }}>
          Page {page} of {totalPages}
        </span>

        <button
          className="cinematic-button page-btn"
          disabled={page >= totalPages || isFetching}
          onClick={() => {
            setPage((p) => p + 1);
            window.scrollTo(0, 0);
          }}
        >
          Next
        </button>
      </div>

      {/* Loading */}
      {isFetching && (
        <div className="loading-container overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Series Grid */}
      {series.length === 0 && !isFetching ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
          No series found.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: "16px",
              opacity: isFetching ? 0.6 : 1,
            }}
          >
            {series.map((show, index) => (
              <div
                key={show.id}
                className="movie-card"
                style={{ animationDelay: `${index * 0.02}s`, opacity: 1 }}
              >
                <ShowCard show={{ ...show, show_type: "series" }} />
              </div>
            ))}
          </div>

          {/* Pagination (Bottom) */}
          <div className="pagination">
            <button
              className="cinematic-button page-btn"
              disabled={page === 1 || isFetching}
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo(0, 0);
              }}
            >
              Previous
            </button>

            <span style={{ alignSelf: "center", color: "var(--text-secondary)" }}>
              Page {page} of {totalPages}
            </span>

            <button
              className="cinematic-button page-btn"
              disabled={page >= totalPages || isFetching}
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo(0, 0);
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
