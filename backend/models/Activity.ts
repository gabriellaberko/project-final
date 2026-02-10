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

export const Activity = mongoose.model("Activity", activitySchema);