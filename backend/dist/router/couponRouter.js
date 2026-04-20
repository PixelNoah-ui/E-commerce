"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const couponController_js_1 = require("../controller/couponController.js");
const AuthController_js_1 = require("../controller/AuthController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Public route - get active coupon
router.get("/today", couponController_js_1.getTodayCoupon);
// Protected routes - admin only
router.use(AuthController_js_1.protect);
router.use((0, auth_js_1.restrictTo)("ADMIN"));
router.post("/", couponController_js_1.createCoupon);
router.get("/", couponController_js_1.getAllCoupons);
router.delete("/:id", couponController_js_1.deleteCoupon);
exports.default = router;
//# sourceMappingURL=couponRouter.js.map