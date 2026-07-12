"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_js_1 = require("../controller/AuthController.js");
const orderController_js_1 = require("../controller/orderController.js");
const router = (0, express_1.Router)();
router.get("/", AuthController_js_1.protect, orderController_js_1.getUserOrders);
router.patch("/:orderId", AuthController_js_1.protect, orderController_js_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orderRouter.js.map