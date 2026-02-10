import mongoose, { Schema } from "mongoose";
import { Activity } from "./Activity";

const daySchema = new Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  activities: [activitySchema]
});


export const Day = mongoose.model("Day", daySchema);