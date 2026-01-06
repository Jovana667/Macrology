import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // STEP 1: Extract token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Check if it starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Invalid token format. Use: Bearer <token>" });
    }

    // Extract just the token part (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // STEP 2: Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-this"
    ) as JWTPayload;

    // STEP 3: Attach user info to request object
    req.user = decoded;

    // STEP 4: Call next() to continue to the actual route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }

    // Catch-all for other errors
    return res.status(401).json({ error: "Authentication failed" });
  }
};
 