import express from "express";
import bcrypt from "bcrypt"; 
import { User } from "../models/User";


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
        message: "An error occured when creating the user",
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



export default router;