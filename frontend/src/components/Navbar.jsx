import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../cinestream.css";
import "../mobile.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="cinematic-navbar glass-panel">
      <NavLink to="/" className="logo">CineStream</NavLink>
      <NavLink to="/movies">Movies</NavLink>
      <NavLink to="/series">Series</NavLink>
      <NavLink to="/watchlist">Watchlist</NavLink>

      {user ? (
        <button onClick={logout} className="cinematic-button">Logout</button>
      ) : (
        <NavLink to="/login">Login</NavLink>
      )}
    </nav>
  );
}
