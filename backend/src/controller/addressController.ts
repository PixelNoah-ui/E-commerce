import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";

const normalizeOptional = (value: unknown) =>
  value === undefined ? undefined : String(value);

export const getMyAddresses = catchAsync(async (req, res) => {
  const addresses = await prisma.userAddress.findMany({
    where: { userId: req.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  res.status(200).json({
    status: "success",
    data: { addresses },
  });
});

export const createAddress = catchAsync(async (req, res, next) => {
  const {
    fullName,
    phone,
    country,
    city,
    state,
    address,
    postalCode,
    isDefault,
  } = req.body as {
    fullName?: string;
    phone?: string;
    country?: string;
    city?: string;
    state?: string;
    address?: string;
    postalCode?: string;
    isDefault?: boolean;
  };

  if (!fullName || !phone || !country || !city || !address) {
    return next(
      new AppError(
        "Full name, phone, country, city, and address are required",
        400,
      ),
    );
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
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
          state: normalizeOptional(state)?.trim() || null,
          address: address.trim(),
          postalCode: normalizeOptional(postalCode)?.trim() || null,
          isDefault: Boolean(isDefault),
        },
      });
    });

    res.status(201).json({
      status: "success",
      data: { address: created },
    });
  } catch (error) {
    next(error);
  }
});

export const updateAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params as { addressId?: string };
  if (!addressId) {
    return next(new AppError("Address id is required", 400));
  }

  const existing = await prisma.userAddress.findFirst({
    where: { id: addressId, userId: req.user.id },
  });

  if (!existing) {
    return next(new AppError("Address not found", 404));
  }

  const {
    fullName,
    phone,
    country,
    city,
    state,
    address,
    postalCode,
    isDefault,
  } = req.body as {
    fullName?: string;
    phone?: string;
    country?: string;
    city?: string;
    state?: string;
    address?: string;
    postalCode?: string;
    isDefault?: boolean;
  };

  try {
    const updated = await prisma.$transaction(async (tx) => {
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
          ...(state !== undefined ? { state: state?.trim() || null } : {}),
          ...(address !== undefined ? { address: address.trim() } : {}),
          ...(postalCode !== undefined
            ? { postalCode: postalCode?.trim() || null }
            : {}),
          ...(isDefault !== undefined ? { isDefault: Boolean(isDefault) } : {}),
        },
      });
    });

    res.status(200).json({
      status: "success",
      data: { address: updated },
    });
  } catch (error) {
    next(error);
  }
});

export const deleteAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params as { addressId?: string };
  if (!addressId) {
    return next(new AppError("Address id is required", 400));
  }

  const existing = await prisma.userAddress.findFirst({
    where: { id: addressId, userId: req.user.id },
  });

  if (!existing) {
    return next(new AppError("Address not found", 404));
  }

  try {
    const remaining = await prisma.userAddress.findMany({
      where: { userId: req.user.id, id: { not: addressId } },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    await prisma.$transaction(async (tx) => {
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
  } catch (error) {
    next(error);
  }
});

export const setDefaultAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params as { addressId?: string };
  if (!addressId) {
    return next(new AppError("Address id is required", 400));
  }

  const existing = await prisma.userAddress.findFirst({
    where: { id: addressId, userId: req.user.id },
  });

  if (!existing) {
    return next(new AppError("Address not found", 404));
  }

  await prisma.$transaction(async (tx) => {
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
