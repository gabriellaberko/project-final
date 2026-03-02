import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { authenticateUser } from "../middlewares/authMiddleware";
import { Request, Response } from "express";


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
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password, salt)
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "User created successfully",
      userId: user._id,
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
        userName: user.userName,
        userId: user._id,
        accessToken: user.accessToken,
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
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// Edit profile
router.patch("/profile", authenticateUser, async (req, res) => {
  try {
    const { userName, bio, isPublic } = req.body;

    const updates: any = {};
    if (bio !== undefined) updates.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
});

// Get public profile of another user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password -email -accessToken");

    if (!user) {
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
    });
  }
});

// Route to get all the followers of a user
router.get("/:userId/followers", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const followers = await User.findById(userId)
      .select("followers")
      .populate("followers", "userName avatarUrl");

    if (!followers) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    };

    return res.status(200).json({
      success: true,
      response: followers,
      message: "Successfully fetched user's follower list"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the user's follower list"
    });
  }
});


// Route to get all users the user is following
router.get("/:userId/following", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const following = await User.findById(userId)
      .select("following")
      .populate("following", "userName avatarUrl");

    if (!following) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    };

    return res.status(200).json({
      success: true,
      response: following,
      message: "Successfully fetched user's following list"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the user's following list"
    });
  }
});


// Route to follow a user (and add to that user's followers list)
router.patch("/:userId/follow", authenticateUser, async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const [addUserToFollowing, addToUsersFollowers] = await Promise.all([
      User.findOneAndUpdate(
        { _id: req.user._id },
        { $addToSet: { following: userId } },
        { new: true, runValidators: true }
      ),
      User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { followers: req.user._id } },
        { new: true, runValidators: true }
      )
    ]);
    
    if (!addUserToFollowing || !addToUsersFollowers) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      response: addToUsersFollowers,
      message: "User successfully followed"
    });

  } catch(err){
    return res.status(500).json({
      success: false,
      message: "Failed to follow user"
    });
  }
});


// Route to un-follow a user
router.patch("/:userId/unfollow", authenticateUser, async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const [removeUserInFollowing, removeFromUsersFollowers] = await Promise.all([
      User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { following: userId } },
        { new: true, runValidators: true }
      ),
      User.findOneAndUpdate(
        { _id: userId },
        { $pull: { followers: req.user._id } },
        { new: true, runValidators: true }
      )
    ]);
     
    if (!removeUserInFollowing || !removeFromUsersFollowers) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      response: removeFromUsersFollowers,
      message: "User successfully unfollowed"
    });

  } catch(err){
    return res.status(500).json({
      success: false,
      message: "Failed to unfollow user"
    });
  }
});


export default router;