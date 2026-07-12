import { Router } from "express";
import {
  signup,
  login,
  logout,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  getMe,
  updateMe,
  googleLogin,
} from "../controller/AuthController.js";
import { restrictTo } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);

router.use(protect);
router.get("/me", getMe);
router.patch("/me", updateMe);
router.use(restrictTo("ADMIN"));
router.patch("/update-password", updatePassword);

export default router;
