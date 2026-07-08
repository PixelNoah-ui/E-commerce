import { Router } from "express";
import { validateCheckout } from "../controller/checkoutController.js";
import { protect } from "../controller/AuthController.js";

const router = Router();

router.post("/validate", protect, validateCheckout);

export default router;
