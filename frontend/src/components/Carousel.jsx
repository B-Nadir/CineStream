import ShowCard from "./ShowCard";
import "../cinestream.css";
import "../mobile.css";

export default function Carousel({ title, shows = [] }) {
  if (!shows || shows.length === 0) {
    return null;
  }

  return (
    <section className="carousel-section">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-track">
        {shows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </section>
  );
}