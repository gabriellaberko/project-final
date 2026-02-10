import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "Missing Authorization header",
      });
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const user = await User.findOne({ accessToken });

    if (!user) {
      return res.status(401).json({
        message: "Authentication missing or invalid",
      });
    }

    req.user = user;

    next();
  } catch (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      });
  }
};
    