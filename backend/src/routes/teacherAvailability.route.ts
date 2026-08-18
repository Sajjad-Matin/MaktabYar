import { Router } from "express";
import {
  setTeacherAvailability,
  getTeacherAvailability,
} from "../controllers/teacherAvailability.controller";

const router = Router();

router.post("/", setTeacherAvailability);

router.get("/:teacherId", getTeacherAvailability);

export default router;
