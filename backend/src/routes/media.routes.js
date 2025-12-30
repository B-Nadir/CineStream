import { Router } from "express";
import { searchMedia } from "../controllers/media.controller.js";

const router = Router();

// Route: GET /search?query=...&type=...
router.get("/", searchMedia);

export default router;
