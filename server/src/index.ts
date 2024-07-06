import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "./routes/auth";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import myHotelRoutes from "./routes/my-hotels";
import userRoutes from "./routes/users";
const port = process.env.PORT;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", async (req: Request, res: Response) => {
  res.json({ message: "API is working" });
});

// app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
// app.get("*", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
// });

app.listen(port, () => {
  console.log("Server is running on Port: " + port);
});
