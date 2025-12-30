import express from "express";
import { listMovies } from "../controllers/movies.controller.js";
import { movieDetail } from "../controllers/movieDetail.controller.js";

const router = express.Router();

router.get("/", listMovies);
router.get("/:id", movieDetail);

export default router;
