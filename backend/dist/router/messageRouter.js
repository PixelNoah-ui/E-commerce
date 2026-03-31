import express from "express";
import { createMessage, deleteMessage, getMessage, getMessages, } from "../controller/MessageController.js";
import { restrictTo } from "../middleware/auth.js";
const router = express.Router();
router.post("/", createMessage);
router.use(restrictTo("ADMIN"));
router.get("/", getMessages);
router.get("/:id", getMessage);
router.delete("/:id", deleteMessage);
export default router;
//# sourceMappingURL=messageRouter.js.map