import { Router } from "express";
import {
  createCoupon,
  getAllCoupons,
  getTodayCoupon,
  deleteCoupon,
} from "../controller/couponController.js";
import { protect } from "../controller/AuthController.js";
import { restrictTo } from "../middleware/auth.js";

const router = Router();

// Public route - get active coupon
router.get("/today", getTodayCoupon);

// Protected routes - admin only
router.use(protect);
router.use(restrictTo("ADMIN"));

router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.delete("/:id", deleteCoupon);

export default router;
