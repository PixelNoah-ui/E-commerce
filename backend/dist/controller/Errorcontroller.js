"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const client_js_1 = require("../generated/prisma/client.js");
const globalErrorHandler = (err, req, res, next) => {
    var _a;
    let error = {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode || 500,
        status: err.status || "error",
        isOperational: (_a = err.isOperational) !== null && _a !== void 0 ? _a : false,
    };
    if (err instanceof multer_1.default.MulterError) {
        error.statusCode = 400;
        error.status = "fail";
        error.isOperational = true;
        error.message =
            err.code === "LIMIT_FILE_SIZE"
                ? "Image is too large. Max 5MB allowed."
                : err.message;
    }
    // Prisma known errors
    if (err instanceof client_js_1.Prisma.PrismaClientKnownRequestError) {
        error = handlePrismaKnownErrors(err);
    }
    // Prisma validation
    if (err instanceof client_js_1.Prisma.PrismaClientValidationError) {
        error = {
            ...err,
            message: "Invalid database input.",
            statusCode: 400,
            status: "fail",
            isOperational: true,
        };
    }
    // Prisma initialization
    if (err instanceof client_js_1.Prisma.PrismaClientInitializationError) {
        error = {
            ...err,
            message: "Database connection failed.",
            statusCode: 500,
            status: "error",
            isOperational: false,
        };
    }
    // JWT errors
    if (err.name === "JsonWebTokenError") {
        error = {
            ...err,
            message: "Invalid token.",
            statusCode: 401,
            status: "fail",
            isOperational: true,
        };
    }
    if (err.name === "TokenExpiredError") {
        error = {
            ...err,
            message: "Token expired.",
            statusCode: 401,
            status: "fail",
            isOperational: true,
        };
    }
    // Zod / Validation errors
    if (err.name === "ZodError") {
        error = {
            ...err,
            message: "Invalid request data.",
            statusCode: 400,
            status: "fail",
            isOperational: true,
        };
    }
    // Send response
    if (process.env.NODE_ENV === "production") {
        sendProductionError(error, res);
    }
    else {
        sendDevelopmentError(error, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
// Prisma known errors mapper
const handlePrismaKnownErrors = (err) => {
    switch (err.code) {
        case "P2002":
            return {
                ...err,
                message: "Duplicate value.",
                statusCode: 409,
                status: "fail",
                isOperational: true,
            };
        case "P2025":
            return {
                ...err,
                message: "Record not found.",
                statusCode: 404,
                status: "fail",
                isOperational: true,
            };
        case "P2003":
            return {
                ...err,
                message: "Invalid reference.",
                statusCode: 400,
                status: "fail",
                isOperational: true,
            };
        default:
            return {
                ...err,
                message: "Database error.",
                statusCode: 500,
                status: "error",
                isOperational: false,
            };
    }
};
const sendDevelopmentError = (err, res) => {
    const code = err.statusCode || 500;
    res.status(code).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};
const sendProductionError = (err, res) => {
    const code = err.statusCode || 500;
    if (err.isOperational) {
        res.status(code).json({ status: err.status, message: err.message });
    }
    else {
        console.error("💥 UNEXPECTED ERROR:", err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong on the server.",
        });
    }
};
//# sourceMappingURL=Errorcontroller.js.map