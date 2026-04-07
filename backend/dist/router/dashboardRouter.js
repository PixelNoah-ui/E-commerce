import { Router } from "express";
import { getDashboardStats } from "../controller/dashboardController.js";
import { protect } from "../controller/AuthController.js";
const router = Router();
router.use(protect);
router.get("/", getDashboardStats);
export default router;
//# sourceMappingURL=dashboardRouter.js.map