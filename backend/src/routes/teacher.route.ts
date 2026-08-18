import { Router } from "express";
import { getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher, deleteAllTeachers } from "../controllers/teacher.controller";

const router = Router();

router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);
router.delete("/all", deleteAllTeachers);

export default router;
