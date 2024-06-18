import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
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

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.put("/:hotelId", verifyToken, async (req: Request, res: Response) => {
  try {
    const updatedHotel: HotelType = req.body;
    updatedHotel.lastUpdated = new Date();

    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: req.params.hotelId,
        userId: req.userId,
      },
      updatedHotel,
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
