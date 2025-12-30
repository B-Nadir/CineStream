import express from "express";
import { listSeries } from "../controllers/series.controller.js";
import { seriesDetail } from "../controllers/seriesDetail.controller.js";

const router = express.Router();

router.get("/", listSeries);
router.get("/:id", seriesDetail);

export default router;
