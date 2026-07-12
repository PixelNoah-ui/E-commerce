import { Router } from "express";
import {
  chapaCallback,
  getOrder,
  initializeCheckout,
  validateCheckout,
} from "../controller/checkoutController.js";
import { protect } from "../controller/AuthController.js";
import { getUserOrders } from "../controller/orderController.js";

const router = Router();

router.post("/validate", protect, validateCheckout);
router.post("/initialize", protect, initializeCheckout);
router.get("/orders", protect, getUserOrders);
router.get("/order/:orderId", protect, getOrder);
router.route("/chapa/callback").get(chapaCallback).post(chapaCallback);

export default router;
