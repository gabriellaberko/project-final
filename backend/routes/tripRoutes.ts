import express from "express";
import { Trip } from "../models/Trip";
import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import mongoose from "mongoose";


const router = express.Router();

// Repetetive ownership logic
const getTripIfOwner = async (
  tripId: string,
  userId: mongoose.Types.ObjectId,
  res: Response
) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    res.status(404).json({
      message: "Trip not found"
    });
    return null;
  }

  if (!trip.creator.equals(userId)) {
    res.status(403).json({
      success: false,
      message: "Not authorized"
    });
    return null;
  }

  return trip;
};

// Route to get all trips for view only when not authenticated.
router.get("/", async (req: Request, res: Response) => {
  try {
    const { destination } = req.query; // If it should be possible to filter on destination, can add more

    const query: any = { isPublic: true };

    if (typeof destination === "string") {
      query.destination = {
        $regex: destination, // Enables partial matching
        $options: "i" // Case-insensitive search
      }
    }

    const publicTrips = await Trip
      .find(query)
      .populate("creator", "userName"); // If we want to show who created the trip, otherwise remove

    return res.status(200).json({
      success: true,
      response: publicTrips,
      message: "Success"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public trips",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


// Route to get a single trip
router.get("/:tripId", async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId).populate("creator", "userName");

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    // if public, anyone can see
    if (trip.isPublic) {
      return res.status(200).json({
        success: true,
        response: trip,
        message: "Success"
      });
    }

    // if private and not logged in -> forbidden
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    // if private and logged in, but not owner -> forbidden
    if (!trip.creator.equals(req.user!._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    return res.status(200).json({
      success: true,
      response: trip,
      message: "Success"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trip",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


// TODO: add route for overview of your own created trips

// TODO: add route for overview of all your liked trips from others

// TODO: add route to remove liked (starred) trip


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

    const trip = await getTripIfOwner(
      tripId as string,
      req.user!._id,
      res
    );

    if (!trip) return; // important

    const nextDayNumber = trip.days.length + 1;

    const newDay = {
      dayNumber: nextDayNumber,
      activities: [],
    };

    trip.days.push(newDay);

    const updatedTrip = await trip.save();

    return res.status(200).json({
      success: true,
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

    const trip = await getTripIfOwner(
      tripId as string,
      req.user!._id,
      res
    );

    if (!trip) return;

    const day = trip.days.id(dayId as any);

    if (!day) {
      return res.status(404).json({
        success: false,
        message: "Day not found"
      });
    }

    day.deleteOne();

    // Renumber remaining days
    trip.days.forEach((day, index) => {
      day.dayNumber = index + 1;
    })

    const updatedTrip = await trip.save();
    return res.status(200).json({
      success: true,
      response: updatedTrip,
      message: "Day deleted successfully"
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

    const trip = await getTripIfOwner(
      tripId as string,
      req.user!._id,
      res
    );

    if (!trip) return;

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

// Route to update an activity
router.patch("/:tripId/days/:dayId/activities/:activityId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { tripId, dayId, activityId } = req.params;

    const trip = await getTripIfOwner(
      tripId as string,
      req.user!._id,
      res
    );

    if (!trip) return;

    const day = trip.days.id(dayId as any);

    if (!day) {
      return res.status(404).json({
        success: false,
        message: "Day not found"
      });
    }

    const activity = day.activities.id(activityId as any);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    type ActivityKeys = "name" | "description" | "category" | "time" | "googleMapLink";

    const allowedUpdates: ActivityKeys[] = [
      "name",
      "description",
      "category",
      "time",
      "googleMapLink"
    ];

    allowedUpdates.forEach((field) => {
      if (field in req.body) {
        activity[field] = req.body[field];
      }
    });

    const updatedTrip = await trip.save();
    return res.status(200).json({
      success: true,
      response: updatedTrip,
      message: "Activity updated successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update activity",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// Route to delete an acitivity
router.delete("/:tripId/days/:dayId/activities/:activityId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { tripId, dayId, activityId } = req.params;

    const trip = await getTripIfOwner(
      tripId as string,
      req.user!._id,
      res
    );

    if (!trip) return;

    const day = trip.days.id(dayId as any);

    if (!day) {
      return res.status(404).json({
        success: false,
        message: "Day not found"
      });
    }

    const activity = day.activities.id(activityId as any);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    activity.deleteOne();

    const updatedTrip = await trip.save();
    return res.status(200).json({
      success: true,
      response: updatedTrip,
      message: "Activity deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Could not delete activity",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


export default router;