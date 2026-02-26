import mongoose, { Schema } from "mongoose";

const cityImageSchema = new Schema({
  city: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

export const CityImage = mongoose.model("CityImage", cityImageSchema);