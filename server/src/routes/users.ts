import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import verifyToken from "../middleware/auth";
import User from "../models/User";

const router = express.Router();

const isProd = process.env.NODE_ENV === "production";

// Rate limiting: max 10 registrations per hour per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many accounts created from this IP, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const handleRegistration = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0]?.msg || "Validation error" });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(400).json({ message: "User already exists with that email" });
    }

    user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password,
    });

    await user.save();

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

    return res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const registrationValidation = [
  check("firstName", "First Name is required").trim().notEmpty().isString(),
  check("lastName", "Last Name is required").trim().notEmpty().isString(),
  check("email", "A valid email is required").isEmail().normalizeEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
];

// Support both /register and /registeration for backwards compatibility
router.post("/register", registerLimiter, registrationValidation, handleRegistration);
router.post("/registeration", registerLimiter, registrationValidation, handleRegistration);

export default router;
