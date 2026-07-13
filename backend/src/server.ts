import dotenv from "dotenv";
import app from "./index.js";
import { prisma } from "./lib/Prisma.js";
import morgan from "morgan";
dotenv.config();

const PORT = process.env.PORT || 8000;
app.use(morgan("dev"));
let server: ReturnType<typeof app.listen>;

async function start() {
  await prisma.$connect();

  server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Server running on port ${PORT}`);
    }
  });
}

start();

process.on("unhandledRejection", (err: any) => {
  // Log to server logs only, never expose to users
  if (process.env.NODE_ENV !== "production") {
    console.error("Unhandled Rejection:", err);
  }
  server?.close(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  // Log to server logs only
  if (process.env.NODE_ENV !== "production") {
    console.error("Uncaught Exception:", err);
  }
  process.exit(1);
});

process.on("SIGTERM", async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("SIGTERM received. Shutting down...");
  }
  server?.close(async () => {
    await prisma.$disconnect();
  });
});
