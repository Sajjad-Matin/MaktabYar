import { Router } from "express";
import {
  createTeacherSubject,
  deleteTeacherSubject,
  deleteAllTeacherSubjects,
  getAllTeacherSubjects,
  getTeacherSubjectById,
  updateTeacherSubject,
} from "../controllers/teacherSubject.controller";

const router = Router();

router.post("/", createTeacherSubject);
router.get("/", getAllTeacherSubjects);
router.get("/:teacherId", getTeacherSubjectById);
router.put("/:id", updateTeacherSubject);
router.delete("/all", deleteAllTeacherSubjects);
router.delete("/:id", deleteTeacherSubject);

export default router;
