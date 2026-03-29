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
export const getProducts = catchAsync(async (_req, res) => {
  const products = await prisma.product.findMany();

  res.status(200).json({
    status: "success",
    results: products.length,
    data: { products },
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
