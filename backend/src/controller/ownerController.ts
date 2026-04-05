import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";

const OWNER_ADDRESS_ID = "fixed-owner-address-id";

export const createOwnerAddress = catchAsync(async (req, res, next) => {
  const { fullName, email, phone, address, location } = req.body;

  if (!fullName || !email) {
    return next(new AppError("Full name and email are required", 400));
  }

  const owner = await prisma.ownerAddress.upsert({
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

export const getOwnerAddresses = catchAsync(async (_req, res) => {
  const owner = await prisma.ownerAddress.findUnique({
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

export const getOwnerAddress = catchAsync(async (req, res, next) => {
  const owner = await prisma.ownerAddress.findUnique({
    where: { id: OWNER_ADDRESS_ID },
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
  const { fullName, email, phone, address, location } = req.body;

  const data: Record<string, unknown> = {};

  if (fullName !== undefined) data.fullName = String(fullName);
  if (email !== undefined) data.email = String(email);
  if (phone !== undefined) data.phone = String(phone);
  if (address !== undefined) data.address = String(address);
  if (location !== undefined) data.location = String(location);

  const updatedOwner = await prisma.ownerAddress.upsert({
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

export const deleteOwnerAddress = catchAsync(async (req, res, next) => {
  const ownerAddress = await prisma.ownerAddress.findUnique({
    where: { id: OWNER_ADDRESS_ID },
  });

  if (!ownerAddress) {
    return next(new AppError("OwnerAddress not found", 404));
  }

  await prisma.ownerAddress.delete({ where: { id: OWNER_ADDRESS_ID } });

  res.status(200).json({
    status: "success",
    message: "Owner deleted successfully",
  });
});
