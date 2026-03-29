import { Router } from "express";
import { restrictTo } from "../middleware/auth.js";
import {
  createManager,
  deleteManager,
  getManager,
  getManagers,
  updateManager,
} from "../controller/managerController.js";

const router = Router();

router.use(restrictTo("ADMIN"));

router.post("/", createManager);
router.get("/", getManagers);
router.get("/:id", getManager);
router.patch("/:id", updateManager);
router.delete("/:id", deleteManager);

export default router;
