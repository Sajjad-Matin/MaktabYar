import { Router } from "express";
import {
  getAdminOverview,
  activatePackage,
  cancelPurchaseRequest,
  updateUserCredits,
  createUserWithPackage,
} from "../controllers/admin.controller";

const router = Router();

router.get("/overview", getAdminOverview);
router.post("/users", createUserWithPackage);
router.post("/activate-package", activatePackage);
router.post("/users/:userId/credits", updateUserCredits);
router.post("/purchase-requests/:id/cancel", cancelPurchaseRequest);

export default router;
