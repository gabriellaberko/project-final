import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";

export const optionalAuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return next();
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const user = await User.findOne({ accessToken });

    if (user) {
      req.user = user;
    }

    next();

  } catch (err) {
    next();
  }
};