import { Router } from "express";
import { getDashboardStats } from "../controller/dashboardController.js";

const router = Router();
router.get("/", getDashboardStats);

export default router;
