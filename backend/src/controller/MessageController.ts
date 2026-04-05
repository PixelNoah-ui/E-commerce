import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";

export const createMessage = catchAsync(async (req, res, next) => {
  const { name, phone, subject, message } = req.body;

  if (!name || !phone || !subject || !message) {
    return next(new AppError("All fields are required", 400));
  }

  const phonePattern = /^(09\d{8}|\+2519\d{8})$/;
  if (!phonePattern.test(phone)) {
    return next(new AppError("Invalid Ethiopian phone number", 400));
  }

  const newMessage = await prisma.message.create({
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
export const getMessages = catchAsync(async (req, res) => {
  const { q, page = "1" } = req.query;

  const limit = 10;
  const pageNumber = parseInt(page as string) || 1;
  const skip = (pageNumber - 1) * limit;

  const where: any = {};

  if (q) {
    where.OR = [
      { name: { contains: q as string, mode: "insensitive" } },
      { phone: { contains: q as string, mode: "insensitive" } },
      { subject: { contains: q as string, mode: "insensitive" } },
      { message: { contains: q as string, mode: "insensitive" } },
    ];
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.message.count({ where }),
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
export const getMessage = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const message = await prisma.message.findUnique({
    where: { id: id as string },
  });

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { message },
  });
});

// ================= DELETE MESSAGE =================
export const deleteMessage = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const message = await prisma.message.findUnique({
    where: { id: id as string },
  });

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  await prisma.message.delete({ where: { id: id as string } });

  res.status(200).json({
    status: "success",
    message: "Message deleted successfully",
  });
});
