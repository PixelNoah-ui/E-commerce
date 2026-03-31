import { prisma } from "../lib/Prisma.js";
import { catchAsync } from "../utils/catchAsync .js";

// Create Product
export const createProduct = catchAsync(async (req, res) => {
  const { name, description, price, imageUrl, categoryType, isFeatured } =
    req.body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      imageUrl,
      categoryType,
      isFeatured: isFeatured ?? false,
    },
  });

  res.status(201).json({
    status: "success",
    data: { product },
  });
});

// GET ALL PRODUCTS
export const getProducts = catchAsync(async (req, res) => {
  const { q, collection, price_min, price_max, sort, page = "1" } = req.query;

  const where: Record<string, any> = {
    isActive: true,
  };
  const limit = 10;

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
      ? collection.map(String)
      : [String(collection)];
    if (categories.length > 0) {
      where.categoryType = { in: categories };
    }
  }

  if (price_min || price_max) {
    where.price = {};
    if (price_min) {
      const minValue = Number(price_min);
      if (!Number.isNaN(minValue)) where.price.gte = minValue;
    }
    if (price_max) {
      const maxValue = Number(price_max);
      if (!Number.isNaN(maxValue)) where.price.lte = maxValue;
    }
  }

  const orderBy =
    sort === "price_asc"
      ? ({ price: "asc" } as const)
      : sort === "price_desc"
        ? ({ price: "desc" } as const)
        : ({ createdAt: "desc" } as const);

  const pageNumber = Number(page) >= 1 ? Number(page) : 1;
  const pageSize = Number(limit) >= 1 ? Number(limit) : 10;
  const skip = (pageNumber - 1) * pageSize;

  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalProducts / pageSize);

  const products = await prisma.product.findMany({
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
export const getProduct = catchAsync(async (req, res) => {
  const id = req.params.id; // string
  const product = await prisma.product.findUnique({
    where: { id: id as string },
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

// UPDATE PRODUCT
export const updateProduct = catchAsync(async (req, res) => {
  const id = req.params.id;

  // Destructure fields from request body
  const { name, description, price, imageUrl, categoryType, isFeatured } =
    req.body;

  // ✅ Build Prisma-compatible update object
  const data: Parameters<typeof prisma.product.update>[0]["data"] = {};

  if (name !== undefined) data.name = String(name);
  if (description !== undefined) data.description = String(description);
  if (price !== undefined) data.price = Number(price);
  if (imageUrl !== undefined) data.imageUrl = String(imageUrl);
  if (categoryType !== undefined) data.categoryType = String(categoryType);
  if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);

  const product = await prisma.product.update({
    where: { id: id as string },
    data,
  });

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

// DELETE PRODUCT
export const deleteProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  await prisma.product.delete({ where: { id: id as string } });

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});

// GET NEW ARRIVAL PRODUCTS
export const getNewArrivals = catchAsync(async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  res.status(200).json({
    status: "success",
    data: { products },
  });
});
