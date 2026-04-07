import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";
import bcrypt from "bcryptjs";

export const createManager = catchAsync(async (req, res, next) => {
  const { email, password, fullName, imageUrl } = req.body;

  if (!email || !password || !fullName) {
    return next(
      new AppError("Email, password, and full name are required", 400),
    );
  }

  const existingManager = await prisma.user.findUnique({ where: { email } });
  if (existingManager) {
    return next(new AppError("A user with this email already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const manager = await prisma.user.create({
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
export const getManagers = catchAsync(async (req, res) => {
  const { q, role = "all", page = "1" } = req.query;

  const limit = 10;
  const pageNumber = parseInt(page as string) || 1;
  const skip = (pageNumber - 1) * limit;

  const where: any = {};

  // ✅ Role filter
  if (role === "manager") {
    where.role = "MANAGER";
  } else if (role === "admin") {
    where.role = "ADMIN";
  }

  // ✅ Search
  if (q) {
    where.OR = [
      { fullName: { contains: q as string, mode: "insensitive" } },
      { email: { contains: q as string, mode: "insensitive" } },
    ];
  }

  const [staff, total] = await Promise.all([
    prisma.user.findMany({
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
    prisma.user.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: staff,
    totalPages: Math.ceil(total / limit),
  });
});

export const getManager = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const manager = await prisma.user.findUnique({ where: { id: id as string } });

  if (!manager || manager.role !== "MANAGER") {
    return next(new AppError("Manager not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { manager },
  });
});

export const updateManager = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const manager = await prisma.user.findUnique({ where: { id: id as string } });

  if (!manager || manager.role !== "MANAGER") {
    return next(new AppError("Manager not found", 404));
  }

  console.log("Request body:", req.body);
  const { email, imageUrl, fullName } = req.body;
  const data: Record<string, unknown> = {};

  if (email !== undefined) data.email = String(email);
  if (fullName !== undefined) data.fullName = String(fullName);
  if (imageUrl !== undefined) data.imageUrl = String(imageUrl);

  const updatedManager = await prisma.user.update({
    where: { id: id as string },
    data,
  });

  res.status(200).json({
    status: "success",
    data: { manager: updatedManager },
  });
});

export const deleteManager = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const manager = await prisma.user.findUnique({ where: { id: id as string } });

  if (!manager || manager.role !== "MANAGER") {
    return next(new AppError("Manager not found", 404));
  }

  await prisma.user.delete({ where: { id: id as string } });

  res.status(200).json({
    status: "success",
    message: "Manager deleted successfully",
  });
});
