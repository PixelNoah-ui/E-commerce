"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultAddress = exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getMyAddresses = void 0;
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
const normalizeOptional = (value) => value === undefined ? undefined : String(value);
exports.getMyAddresses = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    const addresses = await Prisma_js_1.prisma.userAddress.findMany({
        where: { userId: req.user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    res.status(200).json({
        status: "success",
        data: { addresses },
    });
});
exports.createAddress = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { fullName, phone, country, city, state, address, postalCode, isDefault, } = req.body;
    if (!fullName || !phone || !country || !city || !address) {
        return next(new AppError_js_1.AppError("Full name, phone, country, city, and address are required", 400));
    }
    try {
        const created = await Prisma_js_1.prisma.$transaction(async (tx) => {
            var _a, _b;
            if (isDefault) {
                await tx.userAddress.updateMany({
                    where: { userId: req.user.id },
                    data: { isDefault: false },
                });
            }
            return tx.userAddress.create({
                data: {
                    userId: req.user.id,
                    fullName: fullName.trim(),
                    phone: phone.trim(),
                    country: country.trim(),
                    city: city.trim(),
                    state: ((_a = normalizeOptional(state)) === null || _a === void 0 ? void 0 : _a.trim()) || null,
                    address: address.trim(),
                    postalCode: ((_b = normalizeOptional(postalCode)) === null || _b === void 0 ? void 0 : _b.trim()) || null,
                    isDefault: Boolean(isDefault),
                },
            });
        });
        res.status(201).json({
            status: "success",
            data: { address: created },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAddress = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { addressId } = req.params;
    if (!addressId) {
        return next(new AppError_js_1.AppError("Address id is required", 400));
    }
    const existing = await Prisma_js_1.prisma.userAddress.findFirst({
        where: { id: addressId, userId: req.user.id },
    });
    if (!existing) {
        return next(new AppError_js_1.AppError("Address not found", 404));
    }
    const { fullName, phone, country, city, state, address, postalCode, isDefault, } = req.body;
    try {
        const updated = await Prisma_js_1.prisma.$transaction(async (tx) => {
            if (isDefault) {
                await tx.userAddress.updateMany({
                    where: { userId: req.user.id },
                    data: { isDefault: false },
                });
            }
            return tx.userAddress.update({
                where: { id: addressId },
                data: {
                    ...(fullName !== undefined ? { fullName: fullName.trim() } : {}),
                    ...(phone !== undefined ? { phone: phone.trim() } : {}),
                    ...(country !== undefined ? { country: country.trim() } : {}),
                    ...(city !== undefined ? { city: city.trim() } : {}),
                    ...(state !== undefined ? { state: (state === null || state === void 0 ? void 0 : state.trim()) || null } : {}),
                    ...(address !== undefined ? { address: address.trim() } : {}),
                    ...(postalCode !== undefined
                        ? { postalCode: (postalCode === null || postalCode === void 0 ? void 0 : postalCode.trim()) || null }
                        : {}),
                    ...(isDefault !== undefined ? { isDefault: Boolean(isDefault) } : {}),
                },
            });
        });
        res.status(200).json({
            status: "success",
            data: { address: updated },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAddress = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { addressId } = req.params;
    if (!addressId) {
        return next(new AppError_js_1.AppError("Address id is required", 400));
    }
    const existing = await Prisma_js_1.prisma.userAddress.findFirst({
        where: { id: addressId, userId: req.user.id },
    });
    if (!existing) {
        return next(new AppError_js_1.AppError("Address not found", 404));
    }
    try {
        const remaining = await Prisma_js_1.prisma.userAddress.findMany({
            where: { userId: req.user.id, id: { not: addressId } },
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        });
        await Prisma_js_1.prisma.$transaction(async (tx) => {
            await tx.userAddress.delete({ where: { id: addressId } });
            if (existing.isDefault && remaining.length > 0) {
                const nextDefault = remaining[0];
                if (nextDefault) {
                    await tx.userAddress.update({
                        where: { id: nextDefault.id },
                        data: { isDefault: true },
                    });
                }
            }
        });
        res.status(200).json({
            status: "success",
            message: "Address deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.setDefaultAddress = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { addressId } = req.params;
    if (!addressId) {
        return next(new AppError_js_1.AppError("Address id is required", 400));
    }
    const existing = await Prisma_js_1.prisma.userAddress.findFirst({
        where: { id: addressId, userId: req.user.id },
    });
    if (!existing) {
        return next(new AppError_js_1.AppError("Address not found", 404));
    }
    await Prisma_js_1.prisma.$transaction(async (tx) => {
        await tx.userAddress.updateMany({
            where: { userId: req.user.id },
            data: { isDefault: false },
        });
        await tx.userAddress.update({
            where: { id: addressId },
            data: { isDefault: true },
        });
    });
    res.status(200).json({
        status: "success",
        message: "Default address updated",
    });
});
//# sourceMappingURL=addressController.js.map