"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkoutController_js_1 = require("../controller/checkoutController.js");
const AuthController_js_1 = require("../controller/AuthController.js");
const router = (0, express_1.Router)();
router.post("/validate", AuthController_js_1.protect, checkoutController_js_1.validateCheckout);
exports.default = router;
//# sourceMappingURL=checkoutRouter.js.map