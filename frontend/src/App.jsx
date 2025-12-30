import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./cinestream.css";
import "./mobile.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Watchlist from "./pages/Watchlist";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />

              <Route path="/movies/:id" element={<Detail />} />
              <Route path="/series/:id" element={<Detail />} />

              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </BrowserRouter>
    </AuthProvider>
  );
}
