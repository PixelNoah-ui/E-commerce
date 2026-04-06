import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./controller/Errorcontroller.js";
import productRouter from "./router/productRouter.js";
import managerRouter from "./router/managerRouter.js";
import ownerRouter from "./router/ownerAddressRouter.js";
import authRouter from "./router/authRouter.js";
import messageRouter from "./router/messageRouter.js";
import dashboardRouter from "./router/dashboardRouter.js";
const app = express();
app.use(morgan("dev"));

app.use(helmet());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const publicDir = path.join(process.cwd(), "src", "public");
app.use(express.static(publicDir));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/contact/messages", messageRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/managers", managerRouter);
app.use("/api/v1/ownerAddress", ownerRouter);

app.all("/{*any}", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});
app.use(globalErrorHandler);
export default app;
