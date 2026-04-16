"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_js_1 = require("../controller/AuthController.js");
const auth_js_1 = require("../middleware/auth.js");
const ownerController_js_1 = require("../controller/ownerController.js");
const router = (0, express_1.Router)();
router.get("/", ownerController_js_1.getOwnerAddresses);
router.use(AuthController_js_1.protect);
router.use((0, auth_js_1.restrictTo)("ADMIN"));
router.post("/", ownerController_js_1.createOwnerAddress);
router.patch("/", ownerController_js_1.updateOwnerAddress);
router.delete("/", ownerController_js_1.deleteOwnerAddress);
exports.default = router;
//# sourceMappingURL=ownerAddressRouter.js.map