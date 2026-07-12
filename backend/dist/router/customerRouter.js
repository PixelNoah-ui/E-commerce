"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_js_1 = require("../controller/AuthController.js");
const reviewController_js_1 = require("../controller/customer/reviewController.js");
const wishlistController_js_1 = require("../controller/customer/wishlistController.js");
const router = (0, express_1.Router)();
router.use(AuthController_js_1.protect);
router.get("/products/:productId/reviews", reviewController_js_1.getProductReviews);
router.post("/products/:productId/reviews", reviewController_js_1.createReview);
router.patch("/reviews/:reviewId", reviewController_js_1.updateReview);
router.delete("/reviews/:reviewId", reviewController_js_1.deleteReview);
router.get("/wishlist", wishlistController_js_1.getWishlist);
router.post("/wishlist/:productId", wishlistController_js_1.addToWishlist);
router.delete("/wishlist/:productId", wishlistController_js_1.removeFromWishlist);
exports.default = router;
//# sourceMappingURL=customerRouter.js.map