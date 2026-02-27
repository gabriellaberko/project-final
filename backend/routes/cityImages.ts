import express, { Request, Response } from "express";
import { CityImage } from "../models/CityImage";
import { authenticateUser } from "../middlewares/authMiddleware";
import { v2 as cloudinary } from "cloudinary";


const router = express.Router();

type UnsplashResponse = {
  results: {
    urls: {
      regular: string;
    };
  }[];
};

router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City query parameter is required"
      });
    }

    const normalizedCity = city.toLowerCase().trim();

    const existingCity = await CityImage.findOne({ city: normalizedCity });

    if (existingCity && existingCity.images.length >= 3) {
      return res.status(200).json({
        success: true,
        images: existingCity.images
      });
    }

    console.log("Fetching images from unsplash");

    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${normalizedCity}+city&per_page=3&client_id=${process.env.UNSPLASH_KEY}`
    );

    if (!unsplashResponse.ok) {
      throw new Error("Failed to fetch from unsplash");
    }

    const data: UnsplashResponse = await unsplashResponse.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No images found for the specified city"
      });
    }

    const uploadedImages = await Promise.all(
      data.results.map(async (result) => {
        const uploaded = await cloudinary.uploader.upload(
          result.urls.regular,
          { folder: "trip-covers" }
        );
        return uploaded.secure_url;
      })
    );

    await CityImage.findOneAndUpdate(
      { city: normalizedCity },
      { city: normalizedCity, images: uploadedImages },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      images: uploadedImages
    });

  } catch (err) {
    console.error("Error fetching or processing city images:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

export default router;