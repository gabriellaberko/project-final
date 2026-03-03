import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticateUser, upload.single("image"), async (req, res) => {
  console.log("Upload route hit");
  console.log("File:", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(base64, {
      folder: "trip-covers"
    });
    return res.status(200).json({
      success: true,
      imageUrl: uploaded.secure_url
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


router.post("/profile", authenticateUser, upload.single("image"), async (req, res) => {
  console.log("Upload route hit");
  console.log("File:", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(base64, {
      folder: "profile-pictures"
    });
    return res.status(200).json({
      success: true,
      imageUrl: uploaded.secure_url
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


export default router;