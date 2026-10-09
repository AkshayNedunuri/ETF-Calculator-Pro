import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const userEmailHeader = req.headers["x-user-email"] as string;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const secret = process.env.JWT_SECRET || "wealthcalc-super-secret-key-change-me";

      try {
        const decoded = jwt.verify(token, secret) as JWTPayload;
        req.user = decoded;
        return next();
      } catch (err) {
        // Fall through to check userEmailHeader if token verification fails
      }
    }

    if (userEmailHeader) {
      req.user = {
        id: "",
        email: userEmailHeader,
        name: (req.headers["x-user-name"] as string) || "User"
      };
      return next();
    }

    const emailQuery = req.query.email as string;
    if (emailQuery) {
      req.user = {
        id: "",
        email: emailQuery,
        name: "User"
      };
      return next();
    }

    return res.status(401).json({ message: "Unauthorized: No token or user identifier provided" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid authentication" });
  }
};
