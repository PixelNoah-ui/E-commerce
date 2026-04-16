"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOwnerAddress = exports.updateOwnerAddress = exports.getOwnerAddress = exports.getOwnerAddresses = exports.createOwnerAddress = void 0;
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
const OWNER_ADDRESS_ID = "fixed-owner-address-id";
exports.createOwnerAddress = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { fullName, email, phone, address, location } = req.body;
    if (!fullName || !email) {
        return next(new AppError_js_1.AppError("Full name and email are required", 400));
    }
    const owner = await Prisma_js_1.prisma.ownerAddress.upsert({
        where: { id: OWNER_ADDRESS_ID },
        update: {
            fullName,
            email,
            phone,
            address,
            location,
        },
        create: {
            id: OWNER_ADDRESS_ID,
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
exports.getOwnerAddresses = (0, catchAsync__js_1.catchAsync)(async (_req, res) => {
    const owner = await Prisma_js_1.prisma.ownerAddress.findUnique({
        where: { id: OWNER_ADDRESS_ID },
    });
    if (!owner) {
        return res.status(404).json({
            status: "error",
            message: "Owner address not found",
        });
    }
    res.status(200).json({
        status: "success",
        data: { owner },
    });
});
exports.getOwnerAddress = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const owner = await Prisma_js_1.prisma.ownerAddress.findUnique({
        where: { id: OWNER_ADDRESS_ID },
    });
    if (!owner) {
        return next(new AppError_js_1.AppError("Owner not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: { owner },
    });
});
exports.updateOwnerAddress = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    console.log("Request body:", req.body);
    const { fullName, email, phone, address, location } = req.body;
    const data = {};
    if (fullName !== undefined)
        data.fullName = String(fullName);
    if (email !== undefined)
        data.email = String(email);
    if (phone !== undefined)
        data.phone = String(phone);
    if (address !== undefined)
        data.address = String(address);
    if (location !== undefined)
        data.location = String(location);
    const updatedOwner = await Prisma_js_1.prisma.ownerAddress.upsert({
        where: { id: OWNER_ADDRESS_ID },
        update: data,
        create: {
            id: OWNER_ADDRESS_ID,
            fullName: String(fullName || ""),
            email: String(email || ""),
            phone: phone ? String(phone) : null,
            address: address ? String(address) : null,
            location: location ? String(location) : null,
        },
    });
    res.status(200).json({
        status: "success",
        data: { owner: updatedOwner },
    });
});
exports.deleteOwnerAddress = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const ownerAddress = await Prisma_js_1.prisma.ownerAddress.findUnique({
        where: { id: OWNER_ADDRESS_ID },
    });
    if (!ownerAddress) {
        return next(new AppError_js_1.AppError("OwnerAddress not found", 404));
    }
    await Prisma_js_1.prisma.ownerAddress.delete({ where: { id: OWNER_ADDRESS_ID } });
    res.status(200).json({
        status: "success",
        message: "Owner deleted successfully",
    });
});
//# sourceMappingURL=ownerController.js.map