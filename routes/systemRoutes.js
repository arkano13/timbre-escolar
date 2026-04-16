import express from "express";
import { getSystem, updateSystem } from "../controllers/systemController.js";

const router = express.Router();

router.get("/", getSystem);
router.patch("/", updateSystem);

export default router;