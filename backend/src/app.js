import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import authRoutes from './routes/authRoutes.js';
import featureRoutes from './routes/featureRoutes.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health/db', async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/features', featureRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const isServerError = status >= 500;

  res.status(status).json({
    message: isServerError ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' ? { detail: err.message } : {})
  });
});

export default app;
