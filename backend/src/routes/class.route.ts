import { Router } from "express";
import { createClass, deleteAllClasses, deleteClass, getClassById, getClasses, updateClass } from "../controllers/class.controller";

const router = Router();

router.post("/", createClass);
router.get("/", getClasses);
router.get("/:id", getClassById)
router.put("/:id", updateClass)
router.delete("/:id", deleteClass)
router.delete("/", deleteAllClasses)

export default router;
