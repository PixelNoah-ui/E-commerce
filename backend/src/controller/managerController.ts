import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";

export const createManager = catchAsync(async (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return next(
      new AppError("Email, password, and full name are required", 400),
    );
  }

  const existingManager = await prisma.user.findUnique({ where: { email } });
  if (existingManager) {
    return next(new AppError("A user with this email already exists", 409));
  }

  const manager = await prisma.user.create({
    data: {
      email,
      password,
      fullName,
      role: "MANAGER",
    },
  });

  res.status(201).json({
    status: "success",
    data: { manager },
  });
});

export const getManagers = catchAsync(async (_req, res) => {
  const managers = await prisma.user.findMany({
    where: {
      role: "MANAGER",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    status: "success",
    results: managers.length,
    data: { managers },
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

  const { email, password } = req.body;
  const data: Record<string, unknown> = {};

  if (email !== undefined) data.email = String(email);
  if (password !== undefined) data.password = String(password);

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
