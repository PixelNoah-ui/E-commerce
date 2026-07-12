"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_js_1 = require("../controller/AuthController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.post("/signup", AuthController_js_1.signup);
router.post("/login", AuthController_js_1.login);
router.post("/google", AuthController_js_1.googleLogin);
router.post("/forgot-password", AuthController_js_1.forgotPassword);
router.post("/reset-password/:token", AuthController_js_1.resetPassword);
router.post("/logout", AuthController_js_1.logout);
router.use(AuthController_js_1.protect);
router.get("/me", AuthController_js_1.getMe);
router.patch("/me", AuthController_js_1.updateMe);
router.use((0, auth_js_1.restrictTo)("ADMIN"));
router.patch("/update-password", AuthController_js_1.updatePassword);
exports.default = router;
//# sourceMappingURL=authRouter.js.map