import jwt from 'jsonwebtoken';
import prisma from '../lib/prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const registerUser = async (email: string, passwordHash: string, name: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already registered');

  return await prisma.user.create({
    data: { email, password: passwordHash, name }
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const generateToken = (userId: number, email: string) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
};
