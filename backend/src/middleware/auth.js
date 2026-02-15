import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { getBearerToken } from '../utils/authHeader.js';

export const authRequired = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
