import { Router } from "express";
import {
  createEntry,
  deleteEntry,
  generateTimetable,
  getTimetable,
  moveEntry,
  exportTimetable,
} from "../controllers/timetable.controller";

const router = Router();

router.post("/generate", generateTimetable);
router.post("/", createEntry);
router.get("/", getTimetable);
router.get("/export", exportTimetable);
router.delete("/:id", deleteEntry);

router.patch("/:id/move", moveEntry);

export default router;