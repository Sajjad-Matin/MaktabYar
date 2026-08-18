import { Router } from "express";
import {
  assignTeacherSubjectToClass,
  getClassesByTeacherSubject,
  removeTeacherSubjectFromClass,
  getAllTeacherSubjectClasses,
  deleteAllTeacherSubjectClasses,
} from "../controllers/teacherSubjectClass.controller";

const router = Router();

router.get("/", getAllTeacherSubjectClasses);
router.post("/", assignTeacherSubjectToClass);
router.get("/teacher-subject/:teacherSubjectId", getClassesByTeacherSubject);
router.delete("/all", deleteAllTeacherSubjectClasses);
router.delete("/:id", removeTeacherSubjectFromClass);

export default router;
