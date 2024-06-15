import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User";
const router = express.Router();

router.post(
  "/registeration",
  [check("firstName", "First Name is required").isString()],
  [check("lastName", "Last Name is required").isString()],
  [check("email", "Email is required").isEmail()],
  [
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res
          .status(400)
          .json({ message: "User already exists with that e-Mail" });
      }
      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //whether to use SSL or not.
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).send({ message: "User registered succesfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

export default router;
