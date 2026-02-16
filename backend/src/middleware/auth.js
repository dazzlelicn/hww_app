import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { getBearerToken } from '../utils/authHeader.js';

const tokenPayloadSchema = z.object({
  userId: z.number().int().positive(),
  email: z.string().email(),
  role: z.string().min(1)
});

export const authRequired = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const parsed = tokenPayloadSchema.safeParse(decoded);
    if (!parsed.success) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = parsed.data;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
