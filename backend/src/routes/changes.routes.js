import express from "express";
import { runChanges } from "../controllers/changes.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin-only / internal use
router.post("/run", authenticate, runChanges);

export default router;
