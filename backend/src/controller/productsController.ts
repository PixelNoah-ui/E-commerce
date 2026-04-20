import cloudinary from "../lib/cloudinary.js";
import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";

// Create Product
function normalizeCategory(value: string | string[]) {
  return String(value).trim().toUpperCase();
}
export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, imageUrl, categoryType, isFeatured } =
    req.body;

  if (!name || !description || !price || !imageUrl || !categoryType) {
    return next(
      new AppError(
        "Missing required fields: name, description, price, imageUrl, categoryType",
        400,
      ),
    );
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: price, // if using Decimal
        imageUrl,
        categoryType: normalizeCategory(categoryType),
        isFeatured: isFeatured === "true" || isFeatured === true,
      },
    });

    res.status(201).json({
      status: "success",
      data: { product },
    });
  } catch (err: any) {
    console.error("🔥 REAL BACKEND ERROR:", err); // <- see the real error here
    next(new AppError(err.message || "Failed to create product", 500));
  }
});

// GET ALL PRODUCTS
export const getProducts = catchAsync(async (req, res) => {
  const {
    q,
    collection,
    price_min,
    price_max,
    sort,
    page = "1",
  } = req.query as {
    q?: string;
    collection?: string | string[];
    price_min?: string;
    price_max?: string;
    sort?: string;
    page?: string;
  };

  const where: Record<string, any> = {
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
    const priceFilter: Record<string, string> = {};
    if (price_min) {
      const minValue = Number(price_min);
      if (!Number.isNaN(minValue)) priceFilter.gte = String(minValue);
    }
    if (price_max) {
      const maxValue = Number(price_max);
      if (!Number.isNaN(maxValue)) priceFilter.lte = String(maxValue);
    }

    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter;
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

export const getAdminProducts = catchAsync(async (req, res) => {
  const { q, categoryType, page = "1" } = req.query;

  const limit = 10;
  const pageNumber = Math.max(parseInt(page as string) || 1, 1);
  const skip = (pageNumber - 1) * limit;

  const where: any = {};

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
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.product.count({ where }),
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
export const updateProduct = catchAsync(async (req, res) => {
  const id = req.params.id;

  // Destructure fields from request body
  const {
    name,
    description,
    price,
    imageUrl,
    imagePublicId,
    categoryType,
    isFeatured,
  } = req.body;

  const data: Parameters<typeof prisma.product.update>[0]["data"] = {};

  if (name !== undefined) data.name = String(name);
  if (description !== undefined) data.description = String(description);
  if (price !== undefined) data.price = price;

  if (categoryType !== undefined)
    data.categoryType = normalizeCategory(categoryType);
  if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
  if (imageUrl !== undefined) {
    await cloudinary.uploader.destroy(imagePublicId, {
      resource_type: "image",
    });
    data.imageUrl = String(imageUrl);
  }
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
