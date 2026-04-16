"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_js_1 = require("../controller/dashboardController.js");
const AuthController_js_1 = require("../controller/AuthController.js");
const router = (0, express_1.Router)();
router.use(AuthController_js_1.protect);
router.get("/", dashboardController_js_1.getDashboardStats);
exports.default = router;
//# sourceMappingURL=dashboardRouter.js.map