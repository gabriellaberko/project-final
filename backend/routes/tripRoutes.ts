import express from "express";
import { Trip } from "../models/Trip";
import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";


const router = express.Router();

// Post a new trip
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { destination, isPublic, numberOfDays } = req.body;

    // Possible to not add any days, change this if we want to have min number of days = 1. 
    const totalDays = Number(numberOfDays) || 0;
    const days = [];

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        dayNumber: i,
        activities: []
      });
    }

    const newTrip = new Trip({
      destination: destination,
      days: days,
      creator: req.user!._id, // TO DO: Fix TS error - Think this is fixed now
      isPublic: isPublic ? isPublic : true

    });

    const savedNewTrip = await newTrip.save();
    res.status(201).json(savedNewTrip);

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to save trip to database",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


// Route to add days, i.e. update the trip's "days" field with a new day
router.post("/:tripId/days", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Trip not found"
      });
    }

    if (!trip.creator.equals(req.user!._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const nextDayNumber = trip.days.length + 1;

    const newDay = {
      dayNumber: nextDayNumber,
      activities: [],
    }

    trip.days.push(newDay);

    const updatedTrip = await trip.save();
    return res.status(200).json(updatedTrip);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to add day",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});



export default router;