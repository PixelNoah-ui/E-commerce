"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MessageController_js_1 = require("../controller/MessageController.js");
const auth_js_1 = require("../middleware/auth.js");
const AuthController_js_1 = require("../controller/AuthController.js");
const router = express_1.default.Router();
router.post("/", MessageController_js_1.createMessage);
router.use(AuthController_js_1.protect);
router.get("/", MessageController_js_1.getMessages);
router.use((0, auth_js_1.restrictTo)("ADMIN"));
router.get("/:id", MessageController_js_1.getMessage);
router.delete("/:id", MessageController_js_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=messageRouter.js.map