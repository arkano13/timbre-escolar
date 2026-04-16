import express from "express";
import { getTimbreNow } from "../controllers/timbreController.js";

const router = express.Router();

router.get("/now", getTimbreNow);
router.post("/manual", triggerManualRing);

export default router;