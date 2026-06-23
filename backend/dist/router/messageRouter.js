"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MessageController_js_1 = require("../controller/MessageController.js");
const router = express_1.default.Router();
router.post("/", MessageController_js_1.createMessage);
exports.default = router;
//# sourceMappingURL=messageRouter.js.map