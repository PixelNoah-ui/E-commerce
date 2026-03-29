import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controller/productsController.js";
import { restrictTo } from "../middleware/auth.js";

const router = Router();

router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);
router.use(restrictTo("ADMIN"));

router.patch("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
