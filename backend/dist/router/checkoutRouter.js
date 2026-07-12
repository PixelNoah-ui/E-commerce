"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkoutController_js_1 = require("../controller/checkoutController.js");
const AuthController_js_1 = require("../controller/AuthController.js");
const orderController_js_1 = require("../controller/orderController.js");
const router = (0, express_1.Router)();
router.post("/validate", AuthController_js_1.protect, checkoutController_js_1.validateCheckout);
router.post("/initialize", AuthController_js_1.protect, checkoutController_js_1.initializeCheckout);
router.get("/orders", AuthController_js_1.protect, orderController_js_1.getUserOrders);
router.get("/order/:orderId", AuthController_js_1.protect, checkoutController_js_1.getOrder);
router.route("/chapa/callback").get(checkoutController_js_1.chapaCallback).post(checkoutController_js_1.chapaCallback);
exports.default = router;
//# sourceMappingURL=checkoutRouter.js.map