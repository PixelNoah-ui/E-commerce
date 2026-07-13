import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

import { AppError } from "../utils/AppError.js";
import { prisma } from "../lib/Prisma.js";
import sendEmail from "../utils/sendEmail.js";
import { catchAsync } from "../utils/catchAsync .js";
import { resetPasswordTemplate } from "../utils/resetPasswordTemplate.js";
import type { Response } from "express";
import { OAuth2Client } from "google-auth-library";
dotenv.config();

/* ================= TYPES ================= */
interface DecodedToken extends JwtPayload {
  id: string;
  iat: number;
  exp: number;
}
/* ================= CONFIG ================= */
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d";
const JWT_EXPIRES_DAYS = 7;
const JWT_COOKIE_MAX_AGE = JWT_EXPIRES_DAYS * 24 * 60 * 60 * 1000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");
if (!GOOGLE_CLIENT_ID) throw new Error("Missing GOOGLE_CLIENT_ID");

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

/* ================= HELPER ================= */
const signToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const createSendToken = (
  user: any,
  statusCode: number,
  res: Response,
  message: string,
) => {
  const token = signToken(user.id);
  const isProd = process.env.NODE_ENV === "production";
  const userData = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    imageUrl: user.imageUrl ?? null,
  };

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: isProd ? ".abdulectroncs.com" : undefined,
    path: "/",
    maxAge: JWT_COOKIE_MAX_AGE,
  });

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: { user: userData },
  });
};

/* ================= SIGNUP ================= */
export const signup = catchAsync(async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !email || !password || !confirmPassword) {
    return next(new AppError("All fields required", 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return next(new AppError("Email already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "USER",
    },
  });

  res.status(201).json({
    status: "success",
    data: { user: { id: user.id, fullName: user.fullName, email: user.email } },
  });
});

/* ================= LOGIN ================= */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email & password required", 400));
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // 🔒 Check if account is locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    const remainingTime = Math.ceil(
      (user.lockUntil.getTime() - Date.now()) / 1000 / 60,
    );

    return next(
      new AppError(
        `Account locked. Try again in ${remainingTime} minutes.`,
        403,
      ),
    );
  }

  if (!user.password) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const attempts = user.failedLoginAttempts + 1;

    const updateData: any = {
      failedLoginAttempts: attempts,
    };

    if (attempts >= 5) {
      updateData.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return next(new AppError("Invalid credentials", 401));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockUntil: null,
    },
  });

  createSendToken(user, 200, res, "Logged in successfully");
});

/* ================= LOGOUT ================= */
export const logout = catchAsync(async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: isProd ? ".abdulectroncs.com" : undefined,
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out",
  });
});

export const googleLogin = catchAsync(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res
      .status(400)
      .json({ error: "Google credential token is required" });
  }

  try {
    // 1. Verify the Google Identity token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      return res.status(401).json({ error: "Invalid Google credential" });
    }

    const { sub: googleId, email, name, picture } = payload;

    // 2. Query DB by googleId OR by email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleId }, { email: email }],
      },
    });

    if (user) {
      // Link Google authentication if account was originally created via email password
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleId,
            imageUrl: user.imageUrl || picture || null,
          },
        });
      }
    } else {
      // 3. Create a brand new e-commerce customer (USER role)
      user = await prisma.user.create({
        data: {
          googleId: googleId,
          email: email.toLowerCase(),
          fullName: name ?? email,
          imageUrl: picture ?? null,
          role: "USER", // Matches your schema Enum
          password: null,
        },
      });
    }

    createSendToken(user, 200, res, "Logged in with Google successfully");
  } catch (error) {
    console.error("Google Authentication Error:", error);
    return res
      .status(401)
      .json({ error: "Invalid Google credential authentication failed" });
  }
});

/* ================= PROTECT ================= */
export const protect = catchAsync(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return next(new AppError("Not authenticated", 401));
  }

  let decoded: DecodedToken;

  try {
    decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  if (
    user.password &&
    user.passwordChangedAt &&
    decoded.iat &&
    decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)
  ) {
    return next(new AppError("Password recently changed", 401));
  }

  req.user = user;
  next();
});

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const resetURL = `${process.env.CLIENT_URL}/resetPassword/${resetToken}`;

  await sendEmail({
    email: user.email,
    subject: "Reset your password",
    html: resetPasswordTemplate(resetURL),
  });

  res.status(200).json({
    status: "success",
    message: "Reset link sent to email",
  });
});

/* ================= RESET PASSWORD ================= */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || !confirmPassword) {
    return next(new AppError("All fields required", 400));
  }
  if (newPassword !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  if (!token) {
    return next(new AppError("Token missing", 400));
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token as string)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return next(new AppError("Invalid or expired token", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      passwordChangedAt: new Date(),
    },
  });

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
  });
});

/* ================= UPDATE PASSWORD ================= */
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError("All fields required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.password) {
    return next(new AppError("Current password incorrect", 401));
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return next(new AppError("Current password incorrect", 401));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
  });

  createSendToken(user, 200, res, "Password updated successfully");
});

/* ================= GET ME ================= */
export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      id: req.user.id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      imageUrl: req.user.imageUrl,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const { fullName, email } = req.body as {
    fullName?: string;
    email?: string;
  };

  const data: Record<string, unknown> = {};
  if (fullName !== undefined) data.fullName = String(fullName).trim();
  if (email !== undefined) data.email = String(email).trim().toLowerCase();

  if (Object.keys(data).length === 0) {
    return next(new AppError("No profile fields provided", 400));
  }

  if (data.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email as string },
    });
    if (existing && existing.id !== req.user.id) {
      return next(new AppError("Email already exists", 409));
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data,
  });

  res.status(200).json({
    status: "success",
    data: {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      imageUrl: updatedUser.imageUrl,
    },
  });
});
