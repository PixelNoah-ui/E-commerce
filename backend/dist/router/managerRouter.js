import { Router } from "express";
import { restrictTo } from "../middleware/auth.js";
import { createManager, deleteManager, getManager, getManagers, updateManager, } from "../controller/managerController.js";
import { processProductImage, upload } from "../middleware/uploadImages.js";
const router = Router();
// router.use(restrictTo("ADMIN"));
router.post("/", upload.single("image"), processProductImage, createManager);
router.get("/", getManagers);
router.get("/:id", getManager);
router.patch("/:id", upload.single("image"), processProductImage, updateManager);
router.delete("/:id", deleteManager);
export default router;
//# sourceMappingURL=managerRouter.js.map