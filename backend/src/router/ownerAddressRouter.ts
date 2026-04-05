import { Router } from "express";
import { protect } from "../controller/AuthController.js";
import { restrictTo } from "../middleware/auth.js";
import {
  createOwnerAddress,
  deleteOwnerAddress,
  getOwnerAddresses,
  updateOwnerAddress,
} from "../controller/ownerController.js";

const router = Router();

router.use(protect);
router.use(restrictTo("ADMIN"));

router.post("/", createOwnerAddress);
router.get("/", getOwnerAddresses);
router.patch("/", updateOwnerAddress);
router.delete("/", deleteOwnerAddress);

export default router;
