import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

const hotelValidation = [
  body("name").trim().notEmpty().withMessage("Hotel name is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("type").trim().notEmpty().withMessage("Hotel type is required"),
  body("pricePerNight")
    .notEmpty()
    .isNumeric()
    .custom((val) => Number(val) > 0)
    .withMessage("Price per night must be a positive number"),
  body("starRating")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Star rating must be between 1 and 5"),
  body("facilities")
    .notEmpty()
    .isArray({ min: 1 })
    .withMessage("At least one facility is required"),
  body("adultCount")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Adult count must be at least 1"),
  body("childCount")
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage("Child count cannot be negative"),
  body("imageUrls")
    .isArray({ min: 1 })
    .withMessage("At least one image URL is required"),
];

router.post(
  "/",
  verifyToken,
  hotelValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0]?.msg || "Validation error", errors: errors.array() });
    }

    try {
      const {
        name,
        city,
        country,
        description,
        type,
        pricePerNight,
        starRating,
        facilities,
        adultCount,
        childCount,
        imageUrls,
      } = req.body;

      const newHotelData: Partial<HotelType> = {
        name: String(name).trim(),
        city: String(city).trim(),
        country: String(country).trim(),
        description: String(description).trim(),
        type: String(type).trim(),
        pricePerNight: Number(pricePerNight),
        starRating: Number(starRating),
        facilities: Array.isArray(facilities) ? facilities : [facilities],
        adultCount: Number(adultCount),
        childCount: Number(childCount),
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [imageUrls],
        userId: req.userId as string,
        lastUpdated: new Date(),
        bookings: [],
      };

      const hotel = new Hotel(newHotelData);
      await hotel.save();

      return res.status(201).json(hotel);
    } catch (error) {
      console.error("Error creating hotel:", error);
      return res.status(500).json({ message: "Server Error creating hotel" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId }).sort({ lastUpdated: -1 });
    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching user hotels:", error);
    return res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Hotel ID format" });
  }

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel by id:", error);
    return res.status(500).json({ message: "Error fetching hotel" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  hotelValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0]?.msg || "Validation error", errors: errors.array() });
    }

    const hotelId = req.params.hotelId;
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: "Invalid Hotel ID format" });
    }

    try {
      const {
        name,
        city,
        country,
        description,
        type,
        pricePerNight,
        starRating,
        facilities,
        adultCount,
        childCount,
        imageUrls,
      } = req.body;

      const updateData: Partial<HotelType> = {
        name: String(name).trim(),
        city: String(city).trim(),
        country: String(country).trim(),
        description: String(description).trim(),
        type: String(type).trim(),
        pricePerNight: Number(pricePerNight),
        starRating: Number(starRating),
        facilities: Array.isArray(facilities) ? facilities : [facilities],
        adultCount: Number(adultCount),
        childCount: Number(childCount),
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [imageUrls],
        lastUpdated: new Date(),
      };

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: hotelId,
          userId: req.userId,
        },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found or unauthorized" });
      }

      return res.status(200).json(hotel);
    } catch (error) {
      console.error("Error updating hotel:", error);
      return res.status(500).json({ message: "Something went wrong updating hotel" });
    }
  }
);

export default router;
