import { Router } from "express";
import { signup, login, logout, protect, forgotPassword, resetPassword, updatePassword, getMe, } from "../controller/AuthController.js";
import { restrictTo } from "../middleware/auth.js";
const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.use(protect);
router.post("/logout", logout);
router.get("/me", getMe);
router.use(restrictTo("ADMIN"));
router.patch("/update-password", updatePassword);
export default router;
//# sourceMappingURL=authRouter.js.map