import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";
export const createManager = catchAsync(async (req, res, next) => {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
        return next(new AppError("Email, password, and full name are required", 400));
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
export const getManagers = catchAsync(async (req, res) => {
    const { q, status = "all", page = "1" } = req.query;
    const limit = 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limit;
    const where = { role: "MANAGER" };
    if (q) {
        where.OR = [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
        ];
    }
    if (status === "active") {
        where.isActive = true;
    }
    else if (status === "inactive") {
        where.isActive = false;
    }
    const [managers, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        }),
        prisma.user.count({ where }),
    ]);
    res.status(200).json({
        success: true,
        data: managers,
        totalPages: Math.ceil(total / limit),
    });
});
export const getManager = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const manager = await prisma.user.findUnique({ where: { id: id } });
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
    const manager = await prisma.user.findUnique({ where: { id: id } });
    if (!manager || manager.role !== "MANAGER") {
        return next(new AppError("Manager not found", 404));
    }
    const { email, password } = req.body;
    const data = {};
    if (email !== undefined)
        data.email = String(email);
    if (password !== undefined)
        data.password = String(password);
    const updatedManager = await prisma.user.update({
        where: { id: id },
        data,
    });
    res.status(200).json({
        status: "success",
        data: { manager: updatedManager },
    });
});
export const deleteManager = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const manager = await prisma.user.findUnique({ where: { id: id } });
    if (!manager || manager.role !== "MANAGER") {
        return next(new AppError("Manager not found", 404));
    }
    await prisma.user.delete({ where: { id: id } });
    res.status(200).json({
        status: "success",
        message: "Manager deleted successfully",
    });
});
//# sourceMappingURL=managerController.js.map