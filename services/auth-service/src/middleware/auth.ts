import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Extract token from Authorization header
    // TODO: Verify token
    // TODO: Attach user to req.user
    // TODO: Call next()

    res.status(401).json({ error: 'Authentication middleware - to be implemented' });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};