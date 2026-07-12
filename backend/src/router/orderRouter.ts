import { Router } from "express";
import { protect } from "../controller/AuthController.js";
import {
  getUserOrders,
  updateOrderStatus,
} from "../controller/orderController.js";

const router = Router();

router.get("/", protect, getUserOrders);
router.patch("/:orderId", protect, updateOrderStatus);

export default router;
