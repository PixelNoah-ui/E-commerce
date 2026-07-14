"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewArrivals = exports.deleteProduct = exports.updateProduct = exports.getAdminProducts = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const cloudinary_js_1 = __importDefault(require("../lib/cloudinary.js"));
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
function normalizeCategory(value) {
    return String(value).trim().toUpperCase();
}
function parseJsonField(value) {
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "")
            return undefined;
        try {
            return JSON.parse(trimmed);
        }
        catch {
            return undefined;
        }
    }
    if (typeof value === "object" && value !== null) {
        return value;
    }
    return undefined;
}
exports.createProduct = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { name, description, price, imageUrl, categoryType, isFeatured, quantity, sku, } = req.body;
    const specifications = parseJsonField(req.body.specifications);
    if (!name || !description || !price || !imageUrl || !categoryType) {
        return next(new AppError_js_1.AppError("Missing required fields: name, description, price, imageUrl, categoryType", 400));
    }
    try {
        const product = await Prisma_js_1.prisma.product.create({
            data: {
                name: String(name),
                description: String(description),
                // Prisma Decimal accepts a string representation
                price: String(price),
                imageUrl: String(imageUrl),
                categoryType: normalizeCategory(categoryType),
                isFeatured: isFeatured === "true" || isFeatured === true,
                // optional fields
                ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
                ...(sku !== undefined ? { sku: String(sku) } : {}),
                ...(specifications ? { specifications } : {}),
            },
        });
        res.status(201).json({
            status: "success",
            data: { product },
        });
    }
    catch (err) {
        next(new AppError_js_1.AppError("Failed to create product", 500));
    }
});
// GET ALL PRODUCTS
exports.getProducts = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    const { q, collection, price_min, price_max, sort, page = "1", } = req.query;
    const where = {
        isActive: true,
    };
    const limit = 9;
    if (q) {
        const query = String(q);
        where.OR = [
            {
                name: { contains: query, mode: "insensitive" },
            },
            {
                description: { contains: query, mode: "insensitive" },
            },
        ];
    }
    if (collection) {
        const categories = Array.isArray(collection)
            ? collection.map(normalizeCategory)
            : [normalizeCategory(collection)];
        if (categories.length > 0) {
            where.categoryType = { in: categories };
        }
    }
    if (price_min || price_max) {
        const priceFilter = {};
        if (price_min) {
            const minValue = Number(price_min);
            if (!Number.isNaN(minValue))
                priceFilter.gte = String(minValue);
        }
        if (price_max) {
            const maxValue = Number(price_max);
            if (!Number.isNaN(maxValue))
                priceFilter.lte = String(maxValue);
        }
        if (Object.keys(priceFilter).length > 0) {
            where.price = priceFilter;
        }
    }
    const orderBy = sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
            ? { price: "desc" }
            : { createdAt: "desc" };
    const pageNumber = Number(page) >= 1 ? Number(page) : 1;
    const pageSize = Number(limit) >= 1 ? Number(limit) : 10;
    const skip = (pageNumber - 1) * pageSize;
    const totalProducts = await Prisma_js_1.prisma.product.count({ where });
    const totalPages = Math.ceil(totalProducts / pageSize);
    const products = await Prisma_js_1.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
    });
    res.status(200).json({
        status: "success",
        data: {
            products,
            totalPages,
        },
    });
});
// GET SINGLE PRODUCT
exports.getProduct = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    const id = req.params.id; // string
    const product = await Prisma_js_1.prisma.product.findUnique({
        where: { id: id },
    });
    if (!product) {
        return res.status(404).json({
            status: "fail",
            message: "Product not found",
        });
    }
    res.status(200).json({
        status: "success",
        data: { product },
    });
});
exports.getAdminProducts = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    const { q, categoryType, page = "1" } = req.query;
    const limit = 10;
    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const skip = (pageNumber - 1) * limit;
    const where = {};
    // 🔍 Search
    if (q && typeof q === "string" && q.trim() !== "") {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { categoryType: { contains: q, mode: "insensitive" } },
        ];
    }
    if (categoryType && typeof categoryType === "string") {
        where.categoryType = normalizeCategory(categoryType);
    }
    const [products, total] = await Promise.all([
        Prisma_js_1.prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        Prisma_js_1.prisma.product.count({ where }),
    ]);
    res.status(200).json({
        success: true,
        data: products,
        pagination: {
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});
// UPDATE PRODUCT
exports.updateProduct = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    // Destructure fields from request body
    const { name, description, price, imageUrl, imagePublicId, categoryType, isFeatured, } = req.body;
    const specifications = parseJsonField(req.body.specifications);
    const data = {};
    if (name !== undefined)
        data.name = String(name);
    if (description !== undefined)
        data.description = String(description);
    if (price !== undefined)
        data.price = String(price);
    if (specifications !== undefined)
        data.specifications = specifications;
    // handle additional schema fields
    if (req.body.quantity !== undefined)
        data.quantity = Number(req.body.quantity);
    if (req.body.sku !== undefined)
        data.sku = String(req.body.sku);
    if (req.body.isActive !== undefined)
        data.isActive = Boolean(req.body.isActive === "true" || req.body.isActive === true);
    if (categoryType !== undefined)
        data.categoryType = normalizeCategory(categoryType);
    if (isFeatured !== undefined)
        data.isFeatured = Boolean(isFeatured);
    if (imageUrl !== undefined) {
        await cloudinary_js_1.default.uploader.destroy(imagePublicId, {
            resource_type: "image",
        });
        data.imageUrl = String(imageUrl);
    }
    const product = await Prisma_js_1.prisma.product.update({
        where: { id: id },
        data,
    });
    res.status(200).json({
        status: "success",
        data: { product },
    });
});
// DELETE PRODUCT
exports.deleteProduct = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    await Prisma_js_1.prisma.product.delete({ where: { id: id } });
    res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
    });
});
// GET NEW ARRIVAL PRODUCTS
exports.getNewArrivals = (0, catchAsync__js_1.catchAsync)(async (_req, res) => {
    const products = await Prisma_js_1.prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 4,
    });
    res.status(200).json({
        status: "success",
        data: { products },
    });
});
//# sourceMappingURL=productsController.js.map