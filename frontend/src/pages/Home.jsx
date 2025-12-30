import { useEffect, useState } from "react";
import { getHome } from "../services/api";
import "../cinestream.css";
import "../mobile.css";
import Carousel from "../components/Carousel";
import bgImg from "../assets/bg.png";

export default function Home() {
  const [homeData, setHomeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getHome()
      .then(data => {
        setHomeData(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  return (
    <div>
      <div style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(8px) brightness(0.6)",
        zIndex: -1
      }} />
      <h1 className="page-title" style={{textAlign: "center"}}>Discover</h1>
      {loading && (
        <div className="loading-container overlay">
          <div className="spinner"></div>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {homeData && Object.entries(homeData).map(([platform, shows]) => (
        <Carousel key={platform} title={`Top 10 on ${platform}`} shows={shows} />
      ))}
    </div>
  );
}
