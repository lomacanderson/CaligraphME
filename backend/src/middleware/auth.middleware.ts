import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

/**
 * Simple authentication middleware
 * For now, this is a placeholder that allows all requests
 * In a real application, you would verify JWT tokens or session data
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  // For development/testing purposes, we'll use a mock user
  // In production, you would verify the actual authentication token
  const mockUserId = 'a17bc6af-216a-48d9-a2f7-d2085cc94ece'; // Replace with actual user ID from token/session
  
  req.user = {
    id: mockUserId,
    email: 'user@example.com'
  };
  
  next();
};

/**
 * Optional authentication middleware
 * Allows requests to proceed even without authentication
 */
export const optionalAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  // Try to get user from token/session, but don't require it
  const mockUserId = 'mock-user-id';
  
  req.user = {
    id: mockUserId,
    email: 'user@example.com'
  };
  
  next();
};

