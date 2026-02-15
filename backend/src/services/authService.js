import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';

export const registerUser = async ({ email, name, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, passwordHash }
  });

  return createSession(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const matched = await bcrypt.compare(password, user.passwordHash);
  if (!matched) {
    throw new Error('Invalid credentials');
  }

  return createSession(user);
};

const createSession = (user) => {
  const token = jwt.sign({ userId: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: '7d'
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};
