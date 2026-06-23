import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";
import { contactEmailTemplate } from "../utils/contact-email.js";
import sendEmail from "../utils/sendEmail.js";

export const createMessage = catchAsync(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return next(new AppError("All fields are required", 400));
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return next(new AppError("Invalid email address", 400));
  }

  const phonePattern = /^(09\d{8}|\+2519\d{8})$/;
  if (!phonePattern.test(phone)) {
    return next(new AppError("Invalid Ethiopian phone number", 400));
  }

  await sendEmail({
    email: process.env.EMAIL_USERNAME || "",
    subject: `📩 New Contact Inquiry - ${subject}`,
    html: contactEmailTemplate({
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
