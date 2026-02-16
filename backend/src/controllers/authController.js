import { z } from 'zod';
import { loginUser, registerUser } from '../services/authService.js';
import { HttpError } from '../utils/errors.js';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.errors[0]?.message || 'Invalid input');
  }

  const session = await registerUser(parsed.data);
  return res.status(201).json(session);
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.errors[0]?.message || 'Invalid input');
  }

  const session = await loginUser(parsed.data);
  return res.json(session);
};
