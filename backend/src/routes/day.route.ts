import { Router } from "express";
import { createDay, getDays, deleteDay } from "../controllers/day.controller";

const router = Router();

router.post("/", createDay);
router.get("/", getDays);
router.delete("/:id", deleteDay);

export default router;
