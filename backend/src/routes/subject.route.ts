import { Router } from "express";
import { createSubject, deleteAllSubjects, deleteSubject, getAllSubjects, getSubjectById, updateSubject } from "../controllers/subject.controller";

const router = Router();

router.post("/", createSubject);
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById)
router.put("/:id", updateSubject)
router.delete("/:id", deleteSubject)
router.delete("/", deleteAllSubjects)

export default router;