"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManager = exports.updateManager = exports.getManager = exports.getManagers = exports.createManager = void 0;
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.createManager = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { email, password, fullName, imageUrl } = req.body;
    if (!email || !password || !fullName) {
        return next(new AppError_js_1.AppError("Email, password, and full name are required", 400));
    }
    const existingManager = await Prisma_js_1.prisma.user.findUnique({ where: { email } });
    if (existingManager) {
        return next(new AppError_js_1.AppError("A user with this email already exists", 409));
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const manager = await Prisma_js_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            imageUrl,
            fullName,
            role: "MANAGER",
        },
    });
    res.status(201).json({
        status: "success",
        data: { manager },
    });
});
exports.getManagers = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    const { q, role = "all", page = "1" } = req.query;
    const limit = 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limit;
    const where = {};
    // ✅ Role filter
    if (role === "manager") {
        where.role = "MANAGER";
    }
    else if (role === "admin") {
        where.role = "ADMIN";
    }
    // ✅ Search
    if (q) {
        where.OR = [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
        ];
    }
    const [staff, total] = await Promise.all([
        Prisma_js_1.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fullName: true,
                email: true,
                imageUrl: true,
                role: true,
                createdAt: true,
            },
        }),
        Prisma_js_1.prisma.user.count({ where }),
    ]);
    res.status(200).json({
        success: true,
        data: staff,
        totalPages: Math.ceil(total / limit),
    });
});
exports.getManager = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const manager = await Prisma_js_1.prisma.user.findUnique({ where: { id: id } });
    if (!manager || manager.role !== "MANAGER") {
        return next(new AppError_js_1.AppError("Manager not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: { manager },
    });
});
exports.updateManager = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const manager = await Prisma_js_1.prisma.user.findUnique({ where: { id: id } });
    if (!manager || manager.role !== "MANAGER") {
        return next(new AppError_js_1.AppError("Manager not found", 404));
    }
    const { email, imageUrl, fullName } = req.body;
    const data = {};
    if (email !== undefined)
        data.email = String(email);
    if (fullName !== undefined)
        data.fullName = String(fullName);
    if (imageUrl !== undefined)
        data.imageUrl = String(imageUrl);
    const updatedManager = await Prisma_js_1.prisma.user.update({
        where: { id: id },
        data,
    });
    res.status(200).json({
        status: "success",
        data: { manager: updatedManager },
    });
});
exports.deleteManager = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const manager = await Prisma_js_1.prisma.user.findUnique({ where: { id: id } });
    if (!manager || manager.role !== "MANAGER") {
        return next(new AppError_js_1.AppError("Manager not found", 404));
    }
    await Prisma_js_1.prisma.user.delete({ where: { id: id } });
    res.status(200).json({
        status: "success",
        message: "Manager deleted successfully",
    });
});
//# sourceMappingURL=managerController.js.map