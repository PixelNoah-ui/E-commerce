"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const managerController_js_1 = require("../controller/managerController.js");
const uploadImages_js_1 = require("../middleware/uploadImages.js");
const AuthController_js_1 = require("../controller/AuthController.js");
const router = (0, express_1.Router)();
router.use(AuthController_js_1.protect);
router.use((0, auth_js_1.restrictTo)("ADMIN"));
router.get("/", managerController_js_1.getManagers);
router.post("/", uploadImages_js_1.upload.single("image"), uploadImages_js_1.processProductImage, managerController_js_1.createManager);
router.get("/:id", managerController_js_1.getManager);
router.patch("/:id", uploadImages_js_1.upload.single("image"), uploadImages_js_1.processProductImage, managerController_js_1.updateManager);
router.delete("/:id", managerController_js_1.deleteManager);
exports.default = router;
//# sourceMappingURL=managerRouter.js.map