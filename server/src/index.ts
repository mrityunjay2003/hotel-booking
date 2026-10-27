import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import myHotelRoutes from "./routes/my-hotels";
import userRoutes from "./routes/users";

const app = express();
const port = process.env.PORT || 7000;

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Body and cookie parsing
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Health check endpoints
app.get("/api/health", (_req: Request, res: Response) => {
  return res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api", (_req: Request, res: Response) => {
  return res.status(200).json({ message: "API is working" });
});

// Application Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  return res.status(404).json({ message: "Endpoint not found" });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  return res.status(status).json({ message });
});

// Database connection & server start
const mongoUri = process.env.MONGODB_CONNECTION_STRING;

if (!mongoUri) {
  console.warn("WARNING: MONGODB_CONNECTION_STRING is not defined in environment variables!");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export default app;
