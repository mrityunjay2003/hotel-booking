import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import verifyToken from "../middleware/auth";
import User from "../models/User";

const router = express.Router();

const isProd = process.env.NODE_ENV === "production";

// Rate limiting for login route: max 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/login",
  loginLimiter,
  [
    check("email", "A valid email is required").isEmail().normalizeEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0]?.msg || "Invalid credentials" });
    }

    const { email, password } = req.body;

    try {
      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        console.error("JWT_SECRET_KEY is not defined");
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign(
        { userId: user.id },
        secretKey,
        {
          expiresIn: "1d",
          algorithm: "HS256",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  return res.status(200).json({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
