import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";
export const createOwnerAddress = catchAsync(async (req, res, next) => {
    const { fullName, email, phone, address, location } = req.body;
    if (!fullName || !email) {
        return next(new AppError("Full name and email are required", 400));
    }
    const existingOwner = await prisma.ownerAddress.findUnique({
        where: { email },
    });
    if (existingOwner) {
        return next(new AppError("An owner with this email already exists", 409));
    }
    const owner = await prisma.ownerAddress.create({
        data: {
            fullName,
            email,
            phone,
            address,
            location,
        },
    });
    res.status(201).json({
        status: "success",
        data: { owner },
    });
});
export const getOwnerAddresses = catchAsync(async (_req, res) => {
    const owners = await prisma.ownerAddress.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    res.status(200).json({
        status: "success",
        results: owners.length,
        data: { owners },
    });
});
export const getOwnerAddress = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const owner = await prisma.ownerAddress.findUnique({
        where: { id: id },
    });
    if (!owner) {
        return next(new AppError("Owner not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: { owner },
    });
});
export const updateOwnerAddress = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const owner = await prisma.ownerAddress.findUnique({
        where: { id: id },
    });
    if (!owner) {
        return next(new AppError("Owner not found", 404));
    }
    const { fullName, email, phone, address, location } = req.body;
    const data = {};
    if (fullName !== undefined)
        data.fullName = String(fullName);
    if (email !== undefined) {
        const existingOwner = await prisma.ownerAddress.findUnique({
            where: { email: String(email) },
        });
        if (existingOwner && existingOwner.id !== id) {
            return next(new AppError("Email already in use", 409));
        }
        data.email = String(email);
    }
    if (phone !== undefined)
        data.phone = String(phone);
    if (address !== undefined)
        data.address = String(address);
    if (location !== undefined)
        data.location = String(location);
    const updatedOwner = await prisma.ownerAddress.update({
        where: { id: id },
        data,
    });
    res.status(200).json({
        status: "success",
        data: { owner: updatedOwner },
    });
});
export const deleteOwnerAddress = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ownerAddress = await prisma.ownerAddress.findUnique({
        where: { id: id },
    });
    if (!ownerAddress) {
        return next(new AppError("OwnerAddress not found", 404));
    }
    await prisma.ownerAddress.delete({ where: { id: id } });
    res.status(200).json({
        status: "success",
        message: "Owner deleted successfully",
    });
});
//# sourceMappingURL=ownerController.js.map