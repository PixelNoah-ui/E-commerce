"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        service: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const mailOptions = {
        from: `Abdu electronics" <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };
    await transporter.sendMail(mailOptions);
};
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map