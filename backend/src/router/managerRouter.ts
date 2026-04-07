import { Router } from "express";
import { restrictTo } from "../middleware/auth.js";
import {
  createManager,
  deleteManager,
  getManager,
  getManagers,
  updateManager,
} from "../controller/managerController.js";
import { processProductImage, upload } from "../middleware/uploadImages.js";
import { protect } from "../controller/AuthController.js";

const router = Router();
router.use(protect);
router.use(restrictTo("ADMIN"));
router.get("/", getManagers);
router.post("/", upload.single("image"), processProductImage, createManager);
router.get("/:id", getManager);
router.patch(
  "/:id",
  upload.single("image"),
  processProductImage,
  updateManager,
);
router.delete("/:id", deleteManager);

export default router;
