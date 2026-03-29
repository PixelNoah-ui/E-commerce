import { Router } from "express";
import { protect } from "../controller/AuthController.js";
import { restrictTo } from "../middleware/auth.js";
import {
  createOwnerAddress,
  deleteOwnerAddress,
  getOwnerAddress,
  getOwnerAddresses,
  updateOwnerAddress,
} from "../controller/ownerController.js";

const router = Router();

router.use(protect);
router.use(restrictTo("ADMIN"));

router.post("/", createOwnerAddress);
router.get("/", getOwnerAddresses);
router.get("/:id", getOwnerAddress);
router.patch("/:id", updateOwnerAddress);
router.delete("/:id", deleteOwnerAddress);

export default router;
