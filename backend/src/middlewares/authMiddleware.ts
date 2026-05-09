import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = user as { id: number; email: string };
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization token required' });
  }
};
