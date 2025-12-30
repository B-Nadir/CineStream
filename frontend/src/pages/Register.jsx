import { useState, useEffect } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../cinestream.css";
import "../mobile.css";
import bgImg from "../assets/bg.png";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError(null);

    try {
      await registerUser(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  }

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
      
      <h1 className="page-title" style={{ textAlign: "center" }}>Register</h1>

      <div className="auth-container glass-panel" style={{ maxWidth: "500px" }}>
        {error && (
          <p style={{ color: "#ff4d4d", textAlign: "center" }}>
            {error}
          </p>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            className="form-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="form-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="cinematic-button">
            Register
          </button>
        </form>

        <Link to="/login" className="auth-link">
          Already have an account? <strong>Login</strong>
        </Link>
      </div>
    </div>
  );
}
