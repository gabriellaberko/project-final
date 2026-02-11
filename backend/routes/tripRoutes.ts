import express from "express";
import { Trip } from "../models/Trip";
import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";


const router = express.Router();


// TODO: a route to get all trips for view only when not authenticated. 


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


// Route to delete a trip
router.delete("/:tripId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;

    const deletedTrip = await Trip.findOneAndDelete({
      _id: tripId,
      creator: req.user!._id
    });

    if (!deletedTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found or not authorized"
      });
    }

    return res.status(200).json({
      success: true,
      response: deletedTrip,
      message: "Trip deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete trip",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


// Route to add days, i.e. update the trip's "days" field with a new day
router.post("/:tripId/days", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

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
    return res.status(200).json({
      succes: true,
      response: updatedTrip
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to add day",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


// Route to delete a day
router.delete("/:tripId/days/:dayId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { tripId, dayId } = req.params;

    const trip = await Trip.findById(tripId);

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

    const day = trip.days.id(dayId as any);

    if (!day) {
      return res.status(404).json({
        success: false,
        message: "Day not found"
      });
    }

    day?.deleteOne();

    // Renumber remaining days
    trip.days.forEach((day, index) => {
      day.dayNumber = index + 1;
    })

    const updatedTrip = await trip.save();
    return res.status(200).json({
      success: true,
      response: updatedTrip
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete day",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// Route to add actitivty
router.post("/:tripId/days/:dayId/activities", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { tripId, dayId } = req.params;
    const { name, description, category, time, googleMapLink } = req.body;

    const trip = await Trip.findById(tripId);

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

    const day = trip.days.id(dayId as any);

    if (!day) {
      return res.status(404).json({
        success: false,
        message: "Day not found"
      });
    }

    const newActivity = {
      name,
      description,
      category,
      time,
      googleMapLink
    };

    day.activities.push(newActivity);

    const updatedTrip = await trip.save();
    return res.status(200).json({
      success: true,
      response: updatedTrip,
      message: "Activity added successfully"
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to add activity",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// TODO: add route for update and delete an activity


export default router;