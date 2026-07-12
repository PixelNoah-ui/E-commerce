"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Errorcontroller_js_1 = require("./controller/Errorcontroller.js");
const productRouter_js_1 = __importDefault(require("./router/productRouter.js"));
const managerRouter_js_1 = __importDefault(require("./router/managerRouter.js"));
const ownerAddressRouter_js_1 = __importDefault(require("./router/ownerAddressRouter.js"));
const authRouter_js_1 = __importDefault(require("./router/authRouter.js"));
const messageRouter_js_1 = __importDefault(require("./router/messageRouter.js"));
const dashboardRouter_js_1 = __importDefault(require("./router/dashboardRouter.js"));
const checkoutRouter_js_1 = __importDefault(require("./router/checkoutRouter.js"));
const orderRouter_js_1 = __importDefault(require("./router/orderRouter.js"));
const addressRouter_js_1 = __importDefault(require("./router/addressRouter.js"));
const customerRouter_js_1 = __importDefault(require("./router/customerRouter.js"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
}));
app.use((0, cookie_parser_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://meqdiadmin.vercel.app",
        "https://meqdielectronics.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
const publicDir = path_1.default.join(process.cwd(), "src", "public");
app.use(express_1.default.static(publicDir));
app.use("/api/v1/test", (req, res) => {
    res.json({ message: "API is working!" });
});
app.use("/api/v1/auth", authRouter_js_1.default);
app.use("/api/v1/dashboard", dashboardRouter_js_1.default);
app.use("/api/v1/checkout", checkoutRouter_js_1.default);
app.use("/api/v1/orders", orderRouter_js_1.default);
app.use("/api/v1/addresses", addressRouter_js_1.default);
app.use("/api/v1/customer", customerRouter_js_1.default);
app.use("/api/v1/contact/messages", messageRouter_js_1.default);
app.use("/api/v1/products", productRouter_js_1.default);
app.use("/api/v1/managers", managerRouter_js_1.default);
app.use("/api/v1/ownerAddress", ownerAddressRouter_js_1.default);
app.all("/{*any}", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: `Can't find ${req.originalUrl} on this server`,
    });
});
app.use(Errorcontroller_js_1.globalErrorHandler);
exports.default = app;
//# sourceMappingURL=index.js.map