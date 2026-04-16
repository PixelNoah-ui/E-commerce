"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getMessage = exports.getMessages = exports.createMessage = void 0;
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
exports.createMessage = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { name, phone, subject, message } = req.body;
    if (!name || !phone || !subject || !message) {
        return next(new AppError_js_1.AppError("All fields are required", 400));
    }
    const phonePattern = /^(09\d{8}|\+2519\d{8})$/;
    if (!phonePattern.test(phone)) {
        return next(new AppError_js_1.AppError("Invalid Ethiopian phone number", 400));
    }
    const newMessage = await Prisma_js_1.prisma.message.create({
        data: {
            name,
            phone,
            subject,
            message,
        },
    });
    res.status(201).json({
        status: "success",
        message: "Message sent successfully",
        data: { message: newMessage },
    });
});
// ================= GET ALL MESSAGES =================
exports.getMessages = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    const { q, page = "1" } = req.query;
    const limit = 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limit;
    const where = {};
    if (q) {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { subject: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
        ];
    }
    const [messages, total] = await Promise.all([
        Prisma_js_1.prisma.message.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        Prisma_js_1.prisma.message.count({ where }),
    ]);
    res.status(200).json({
        success: true,
        data: messages,
        pagination: {
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});
// ================= GET SINGLE MESSAGE =================
exports.getMessage = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const message = await Prisma_js_1.prisma.message.findUnique({
        where: { id: id },
    });
    if (!message) {
        return next(new AppError_js_1.AppError("Message not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: { message },
    });
});
// ================= DELETE MESSAGE =================
exports.deleteMessage = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const message = await Prisma_js_1.prisma.message.findUnique({
        where: { id: id },
    });
    if (!message) {
        return next(new AppError_js_1.AppError("Message not found", 404));
    }
    await Prisma_js_1.prisma.message.delete({ where: { id: id } });
    res.status(200).json({
        status: "success",
        message: "Message deleted successfully",
    });
});
//# sourceMappingURL=MessageController.js.map