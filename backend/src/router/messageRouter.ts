import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessage,
  getMessages,
} from "../controller/MessageController.js";
import { restrictTo } from "../middleware/auth.js";

const router = express.Router();
router.post("/", createMessage);

router.get("/", getMessages);
router.use(restrictTo("ADMIN"));

router.get("/:id", getMessage);

router.delete("/:id", deleteMessage);

export default router;
