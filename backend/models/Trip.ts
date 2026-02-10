import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  time: Date,
  googleMapLink: String
});


const daySchema = new Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  activities: [activitySchema]
});


const tripSchema = new Schema({
  destination: {
    type: String,
    required: true
  },
  days: [daySchema],
  creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  starredBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

export const Trip = mongoose.model("Trip", tripSchema);