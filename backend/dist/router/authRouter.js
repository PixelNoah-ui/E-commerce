import { Router } from "express";
import { signup, login, logout, protect, forgotPassword, resetPassword, updatePassword, getMe, } from "../controller/AuthController.js";
const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.get("/me", getMe);
router.use(protect);
router.patch("/update-password", updatePassword);
export default router;
//# sourceMappingURL=authRouter.js.map