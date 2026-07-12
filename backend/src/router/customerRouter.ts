import { Router } from "express";
import { protect } from "../controller/AuthController.js";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controller/customer/reviewController.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controller/customer/wishlistController.js";

const router = Router();
router.use(protect);

router.get("/products/:productId/reviews", getProductReviews);
router.post("/products/:productId/reviews", createReview);
router.patch("/reviews/:reviewId", updateReview);
router.delete("/reviews/:reviewId", deleteReview);

router.get("/wishlist", getWishlist);
router.post("/wishlist/:productId", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

export default router;
