import express from "express";
import {
  getAllAlarms,
  createAlarm,
  deleteAlarm,
  toggleAlarm,
} from "../controllers/alarmController.js";

const router = express.Router();

router.get("/", getAllAlarms);
router.post("/", createAlarm);
router.delete("/:id", deleteAlarm);
router.patch("/:id/toggle", toggleAlarm);

export default router;