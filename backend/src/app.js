import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import homeRoutes from "./routes/home.routes.js";
import moviesRoutes from "./routes/movies.routes.js";
import seriesRoutes from "./routes/series.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import changesRoutes from "./routes/changes.routes.js";

const app = express();

/* 🔥 CORS MUST COME FIRST */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* 🔥 HANDLE PREFLIGHT */
app.options("*", cors());

app.use(express.json());

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/movies", moviesRoutes);
app.use("/series", seriesRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/search", mediaRoutes);
app.use("/admin/changes", changesRoutes);

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("CineStream API running");
});

export default app;
