import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authService.registerUser(email, passwordHash, name);
    
    const token = authService.generateToken(user.id, user.email);
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    if (error.message === 'Email already registered') {
      return res.status(409).json({ error: error.message });
    }
    console.error("Register error:", error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Mock layer uses 'passwordHash', prisma uses 'password'
    const storedHash = (user as any).passwordHash || (user as any).password;
    const isMatch = await bcrypt.compare(password, storedHash);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = authService.generateToken(user.id, user.email);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Failed to login' });
  }
};
