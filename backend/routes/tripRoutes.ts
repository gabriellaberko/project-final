import express from "express";
import { Trip } from "../models/Trip";
import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";


const router = express.Router();

// Post a new trip
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { destination, isPublic } = req.body;

    const newTrip = new Trip({
      destination: destination,
      days: [],
      creator: req.user._id, // TO DO: Fix TS error
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


// TO DO: A route to add days, i.e. update the trip's "days" field with a new day




export default router;