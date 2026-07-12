import { Router } from "express";
import { protect } from "../controller/AuthController.js";
import {
  createAddress,
  deleteAddress,
  getMyAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controller/addressController.js";

const router = Router();
router.use(protect);
router.get("/", getMyAddresses);
router.post("/", createAddress);
router.patch("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);
router.patch("/:addressId/default", setDefaultAddress);

export default router;
