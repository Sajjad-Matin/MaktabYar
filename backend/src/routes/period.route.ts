import { Router } from "express";
import {
  createPeriod,
  getPeriods,
  deletePeriod,
} from "../controllers/period.controller";

const router = Router();

router.post("/", createPeriod);
router.get("/", getPeriods);
router.delete("/:id", deletePeriod);

export default router;
