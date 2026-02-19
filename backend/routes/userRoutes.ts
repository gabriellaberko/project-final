import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { authenticateUser } from "../middlewares/authMiddleware";


const router = express.Router();

// Signup for a new user
router.post("/signup", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { userName: userName }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An error occurred when creating the user",
      });
    }

    const salt = bcrypt.genSaltSync();

    const user = new User({
      userName,
      email,
      password: bcrypt.hashSync(password, salt)
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "User created successfully",
      id: user._id,
      accessToken: user.accessToken,
      userName: user.userName
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});


//Login
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName: userName.toLowerCase() });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        response: {
          userName: user.userName,
          id: user._id,
          accessToken: user.accessToken,
        }
      })
    } else {
      res.status(401).json({
        success: false,
        message: "Login failed: Wrong username or password",
        response: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      response: err,
    });
  }
});

// Get profile
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
      res.status(200).json(user)
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err instanceof Error ? err.message : String(err)
    })
  }
})

// Edit profile
router.patch("/profile", authenticateUser, async (req, res) => {
  try {
    const { userName, bio, isPublic } = req.body
    
    const updates: any = {}
    if (userName) updates.userName = userName
    if (bio !== undefined) updates.bio = bio
    if (isPublic !== undefined) updates.isPublic = isPublic

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password")

    res.status(200).json(updatedUser)
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    })
  }
})

// Get public profile of another user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password -email -accessToken")

    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    if (!user.isPublic) {
      return res.status(200).json({
        userName: user.userName,
        isPublic: false,
        message: "This account is private"
      })
    }
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    })
  }
})

export default router;