"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_js_1 = require("../controller/AuthController.js");
const addressController_js_1 = require("../controller/addressController.js");
const router = (0, express_1.Router)();
router.use(AuthController_js_1.protect);
router.get("/", addressController_js_1.getMyAddresses);
router.post("/", addressController_js_1.createAddress);
router.patch("/:addressId", addressController_js_1.updateAddress);
router.delete("/:addressId", addressController_js_1.deleteAddress);
router.patch("/:addressId/default", addressController_js_1.setDefaultAddress);
exports.default = router;
//# sourceMappingURL=addressRouter.js.map