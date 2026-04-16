"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productsController_js_1 = require("../controller/productsController.js");
const auth_js_1 = require("../middleware/auth.js");
const uploadImages_js_1 = require("../middleware/uploadImages.js");
const AuthController_js_1 = require("../controller/AuthController.js");
const router = (0, express_1.Router)();
router.get("/new-arrivals", productsController_js_1.getNewArrivals);
router.get("/", productsController_js_1.getProducts);
router.use(AuthController_js_1.protect);
router.post("/", uploadImages_js_1.upload.single("image"), uploadImages_js_1.processProductImage, productsController_js_1.createProduct);
router.get("/admin-products", productsController_js_1.getAdminProducts);
router.get("/:id", productsController_js_1.getProduct);
router.use((0, auth_js_1.restrictTo)("ADMIN"));
router.patch("/:id", uploadImages_js_1.upload.single("image"), uploadImages_js_1.processProductImage, productsController_js_1.updateProduct);
router.delete("/:id", productsController_js_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRouter.js.map