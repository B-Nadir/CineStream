import express from "express";
import {
  listWatchlist,
  addItem,
  removeItem
} from "../controllers/watchlist.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, listWatchlist);
router.post("/", authenticate, addItem);
router.delete("/:showId/:type", authenticate, removeItem);

export default router;
