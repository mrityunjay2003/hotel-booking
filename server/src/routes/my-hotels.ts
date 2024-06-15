import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const newHotel: HotelType = req.body;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId as string;

    const hotel = new Hotel(newHotel);

    await hotel.save();

    res.status(201).send(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
