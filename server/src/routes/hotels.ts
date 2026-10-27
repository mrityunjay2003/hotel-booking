import express, { Request, Response } from "express";
import { param, validationResult } from "express-validator";
import mongoose from "mongoose";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_API_KEY || "sk_test_placeholder_key");

// Helper function to escape user input for safe regular expressions (prevents ReDoS)
const escapeRegex = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination && typeof queryParams.destination === "string" && queryParams.destination.trim()) {
    const safeDestination = escapeRegex(queryParams.destination.trim());
    constructedQuery.$or = [
      { city: new RegExp(safeDestination, "i") },
      { country: new RegExp(safeDestination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    const adults = parseInt(queryParams.adultCount, 10);
    if (!isNaN(adults) && adults > 0) {
      constructedQuery.adultCount = { $gte: adults };
    }
  }

  if (queryParams.childCount) {
    const children = parseInt(queryParams.childCount, 10);
    if (!isNaN(children) && children >= 0) {
      constructedQuery.childCount = { $gte: children };
    }
  }

  if (queryParams.facilities) {
    const facilitiesArray = Array.isArray(queryParams.facilities)
      ? queryParams.facilities
      : [queryParams.facilities];
    constructedQuery.facilities = {
      $all: facilitiesArray,
    };
  }

  if (queryParams.types) {
    const typesArray = Array.isArray(queryParams.types)
      ? queryParams.types
      : [queryParams.types];
    constructedQuery.type = {
      $in: typesArray,
    };
  }

  if (queryParams.stars) {
    const starsArray = Array.isArray(queryParams.stars)
      ? queryParams.stars
      : [queryParams.stars];
    const parsedStars = starsArray
      .map((star: any) => parseInt(star, 10))
      .filter((n: number) => !isNaN(n) && n >= 1 && n <= 5);

    if (parsedStars.length > 0) {
      constructedQuery.starRating = { $in: parsedStars };
    }
  }

  if (queryParams.maxPrice) {
    const maxPrice = parseInt(queryParams.maxPrice, 10);
    if (!isNaN(maxPrice) && maxPrice > 0) {
      constructedQuery.pricePerNight = { $lte: maxPrice };
    }
  }

  return constructedQuery;
};

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions: any = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
      default:
        sortOptions = { lastUpdated: -1 };
    }

    const pageSize = 5;
    const pageNumber = Math.max(
      1,
      parseInt(req.query.page ? req.query.page.toString() : "1", 10) || 1
    );
    const skip = (pageNumber - 1) * pageSize;

    const [hotels, total] = await Promise.all([
      Hotel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),
      Hotel.countDocuments(query),
    ]);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize) || 1,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Hotel search error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort({ lastUpdated: -1 });
    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get(
  "/:id",
  [param("id").trim().notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Hotel ID format" });
    }

    try {
      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      return res.status(200).json(hotel);
    } catch (error) {
      console.error("Error fetching hotel by id:", error);
      return res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { numberOfNights } = req.body;
      const hotelId = req.params.hotelId;

      const parsedNights = parseInt(numberOfNights, 10);
      if (isNaN(parsedNights) || parsedNights <= 0) {
        return res.status(400).json({ message: "Valid number of nights is required" });
      }

      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({ message: "Invalid Hotel ID format" });
      }

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel Not Found" });
      }

      const totalCost = hotel.pricePerNight * parsedNights;
      const validUserId = req.userId || "";

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalCost * 100), // in paise / cents
        currency: "inr",
        metadata: {
          hotelId,
          userId: validUserId,
        },
      });

      if (!paymentIntent.client_secret) {
        return res.status(500).json({ message: "Error creating payment intent" });
      }

      const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        totalCost,
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Payment intent creation error:", error);
      return res.status(500).json({ message: "Failed to initialize payment" });
    }
  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const {
        paymentIntentId,
        firstName,
        lastName,
        email,
        adultCount,
        childCount,
        checkIn,
        checkOut,
        totalCost,
      } = req.body;

      const hotelId = req.params.hotelId;

      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({ message: "Invalid Hotel ID format" });
      }

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment Intent ID is required" });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment intent not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment has not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      // Check for replay attacks: prevent duplicate bookings for the same payment intent
      const existingBooking = await Hotel.findOne({
        _id: hotelId,
        "bookings.paymentIntentId": paymentIntentId,
      });

      if (existingBooking) {
        return res.status(400).json({ message: "This payment has already been applied to a booking" });
      }

      const newBooking: BookingType = {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: req.userId as string,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim().toLowerCase(),
        adultCount: Number(adultCount) || 1,
        childCount: Number(childCount) || 0,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalCost: Number(totalCost),
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: hotelId },
        {
          $push: { bookings: newBooking },
        },
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      return res.status(200).json({ message: "Booking confirmed successfully" });
    } catch (error) {
      console.error("Booking creation error:", error);
      return res.status(500).json({ message: "Something went wrong while booking" });
    }
  }
);

export default router;
