import { z } from 'zod';
import { loginUser, registerUser } from '../services/authService.js';

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
  try {
    const payload = registerSchema.parse(req.body);
    const session = await registerUser(payload);
    return res.status(201).json(session);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const session = await loginUser(payload);
    return res.json(session);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
