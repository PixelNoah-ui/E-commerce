"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.protect = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_js_1 = require("../utils/AppError.js");
const Prisma_js_1 = require("../lib/Prisma.js");
const sendEmail_js_1 = __importDefault(require("../utils/sendEmail.js"));
const catchAsync__js_1 = require("../utils/catchAsync .js");
const resetPasswordTemplate_js_1 = require("../utils/resetPasswordTemplate.js");
dotenv_1.default.config();
/* ================= CONFIG ================= */
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d";
if (!JWT_SECRET)
    throw new Error("Missing JWT_SECRET");
/* ================= HELPER ================= */
const signToken = (id) => jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user.id);
    delete user.password;
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? ".abdulectroncs.com" : ".abdulectroncs.com",
    });
    res.status(statusCode).json({
        status: "success",
        message,
        token,
    });
};
/* ================= SIGNUP ================= */
exports.signup = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || !confirmPassword) {
        return next(new AppError_js_1.AppError("All fields required", 400));
    }
    if (password !== confirmPassword) {
        return next(new AppError_js_1.AppError("Passwords do not match", 400));
    }
    const existing = await Prisma_js_1.prisma.user.findUnique({ where: { email } });
    if (existing) {
        return next(new AppError_js_1.AppError("Email already exists", 409));
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const user = await Prisma_js_1.prisma.user.create({
        data: {
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "USER",
        },
    });
    res.status(201).json({
        status: "success",
        data: { user: { id: user.id, fullName: user.fullName, email: user.email } },
    });
});
/* ================= LOGIN ================= */
exports.login = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError_js_1.AppError("Email & password required", 400));
    }
    const user = await Prisma_js_1.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    });
    if (!user) {
        return next(new AppError_js_1.AppError("Invalid email or password", 401));
    }
    if (user.role === "USER") {
        return next(new AppError_js_1.AppError("You should expect approval by the super admin", 403));
    }
    // 🔒 Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
        const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
        return next(new AppError_js_1.AppError(`Account locked. Try again in ${remainingTime} minutes.`, 403));
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        const attempts = user.failedLoginAttempts + 1;
        const updateData = {
            failedLoginAttempts: attempts,
        };
        if (attempts >= 5) {
            updateData.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        }
        await Prisma_js_1.prisma.user.update({
            where: { id: user.id },
            data: updateData,
        });
        return next(new AppError_js_1.AppError("Invalid credentials", 401));
    }
    await Prisma_js_1.prisma.user.update({
        where: { id: user.id },
        data: {
            failedLoginAttempts: 0,
            lockUntil: null,
        },
    });
    createSendToken(user, 200, res, "Logged in successfully");
});
/* ================= LOGOUT ================= */
exports.logout = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "Logged out",
    });
});
/* ================= PROTECT ================= */
exports.protect = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    var _a;
    // Check cookies first, then Authorization header
    let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }
    if (!token) {
        return next(new AppError_js_1.AppError("Not authenticated", 401));
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return next(new AppError_js_1.AppError("Invalid or expired token", 401));
    }
    const user = await Prisma_js_1.prisma.user.findUnique({
        where: { id: decoded.id },
    });
    if (!user) {
        return next(new AppError_js_1.AppError("User no longer exists", 401));
    }
    if (user.passwordChangedAt) {
        const changedAt = Math.floor(user.passwordChangedAt.getTime() / 1000);
        if (decoded.iat < changedAt) {
            return next(new AppError_js_1.AppError("Password recently changed", 401));
        }
    }
    req.user = user;
    next();
});
/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { email } = req.body;
    const user = await Prisma_js_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return next(new AppError_js_1.AppError("User not found", 404));
    }
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    await Prisma_js_1.prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken: hashedToken,
            resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
        },
    });
    const resetURL = `${process.env.CLIENT_URL}/resetPassword/${resetToken}`;
    await (0, sendEmail_js_1.default)({
        email: user.email,
        subject: "Reset your password",
        html: (0, resetPasswordTemplate_js_1.resetPasswordTemplate)(resetURL),
    });
    res.status(200).json({
        status: "success",
        message: "Reset link sent to email",
    });
});
/* ================= RESET PASSWORD ================= */
exports.resetPassword = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
        return next(new AppError_js_1.AppError("All fields required", 400));
    }
    if (newPassword !== confirmPassword) {
        return next(new AppError_js_1.AppError("Passwords do not match", 400));
    }
    if (!token) {
        return next(new AppError_js_1.AppError("Token missing", 400));
    }
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await Prisma_js_1.prisma.user.findFirst({
        where: {
            resetToken: hashedToken,
            resetTokenExpiry: { gt: new Date() },
        },
    });
    if (!user) {
        return next(new AppError_js_1.AppError("Invalid or expired token", 400));
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
    await Prisma_js_1.prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
            passwordChangedAt: new Date(),
        },
    });
    res.status(200).json({
        status: "success",
        message: "Password reset successful",
    });
});
/* ================= UPDATE PASSWORD ================= */
exports.updatePassword = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new AppError_js_1.AppError("All fields required", 400));
    }
    if (newPassword !== confirmPassword) {
        return next(new AppError_js_1.AppError("Passwords do not match", 400));
    }
    const user = await Prisma_js_1.prisma.user.findUnique({
        where: { id: req.user.id },
    });
    if (!user) {
        return next(new AppError_js_1.AppError("User not found", 404));
    }
    const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isMatch) {
        return next(new AppError_js_1.AppError("Current password incorrect", 401));
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
    await Prisma_js_1.prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordChangedAt: new Date(),
        },
    });
    createSendToken(user, 200, res, "Password updated successfully");
});
/* ================= GET ME ================= */
exports.getMe = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            id: req.user.id,
            fullName: req.user.fullName,
            email: req.user.email,
            role: req.user.role,
        },
    });
});
//# sourceMappingURL=AuthController.js.map