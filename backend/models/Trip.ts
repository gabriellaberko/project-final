import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  time: String,
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
  tripName: {
    type: String,
    trim: true
  },
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
},
  { timestamps: true }
);

export const Trip = mongoose.model("Trip", tripSchema);