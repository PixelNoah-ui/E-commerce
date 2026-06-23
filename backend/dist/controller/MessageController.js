"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = void 0;
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
const contact_email_js_1 = require("../utils/contact-email.js");
const sendEmail_js_1 = __importDefault(require("../utils/sendEmail.js"));
exports.createMessage = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !phone || !subject || !message) {
        return next(new AppError_js_1.AppError("All fields are required", 400));
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return next(new AppError_js_1.AppError("Invalid email address", 400));
    }
    const phonePattern = /^(09\d{8}|\+2519\d{8})$/;
    if (!phonePattern.test(phone)) {
        return next(new AppError_js_1.AppError("Invalid Ethiopian phone number", 400));
    }
    await (0, sendEmail_js_1.default)({
        email: process.env.EMAIL_USERNAME || "",
        subject: `📩 New Contact Inquiry - ${subject}`,
        html: (0, contact_email_js_1.contactEmailTemplate)({
            name,
            email,
            phone,
            subject,
            message,
        }),
        replyTo: email,
    });
    res.status(201).json({
        status: "success",
        message: "Message sent successfully",
    });
});
//# sourceMappingURL=MessageController.js.map