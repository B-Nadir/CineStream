import express from "express";
import { topByPlatform, getHome } from "../controllers/home.controller.js";

const router = express.Router();

router.get("/", getHome);
router.get("/top/:platform", topByPlatform);

export default router;
