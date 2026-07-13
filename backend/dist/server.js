"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const index_js_1 = __importDefault(require("./index.js"));
const Prisma_js_1 = require("./lib/Prisma.js");
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
index_js_1.default.use((0, morgan_1.default)("dev"));
let server;
async function start() {
    await Prisma_js_1.prisma.$connect();
    server = index_js_1.default.listen(PORT, () => {
        if (process.env.NODE_ENV !== "production") {
            console.log(`Server running on port ${PORT}`);
        }
    });
}
start();
process.on("unhandledRejection", (err) => {
    // Log to server logs only, never expose to users
    if (process.env.NODE_ENV !== "production") {
        console.error("Unhandled Rejection:", err);
    }
    server === null || server === void 0 ? void 0 : server.close(async () => {
        await Prisma_js_1.prisma.$disconnect();
        process.exit(1);
    });
});
process.on("uncaughtException", (err) => {
    // Log to server logs only
    if (process.env.NODE_ENV !== "production") {
        console.error("Uncaught Exception:", err);
    }
    process.exit(1);
});
process.on("SIGTERM", async () => {
    if (process.env.NODE_ENV !== "production") {
        console.log("SIGTERM received. Shutting down...");
    }
    server === null || server === void 0 ? void 0 : server.close(async () => {
        await Prisma_js_1.prisma.$disconnect();
    });
});
//# sourceMappingURL=server.js.map