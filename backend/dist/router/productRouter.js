import { Router } from "express";
import { createProduct, deleteProduct, getAdminProducts, getNewArrivals, getProduct, getProducts, updateProduct, } from "../controller/productsController.js";
import { restrictTo } from "../middleware/auth.js";
import { processProductImage, upload } from "../middleware/uploadImages.js";
import { protect } from "../controller/AuthController.js";
const router = Router();
router.get("/new-arrivals", getNewArrivals);
router.get("/", getProducts);
router.use(protect);
router.post("/", upload.single("image"), processProductImage, createProduct);
router.get("/admin-products", getAdminProducts);
router.get("/:id", getProduct);
router.use(restrictTo("ADMIN"));
router.patch("/:id", upload.single("image"), processProductImage, updateProduct);
router.delete("/:id", deleteProduct);
export default router;
//# sourceMappingURL=productRouter.js.map