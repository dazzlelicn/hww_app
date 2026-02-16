import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  databaseUrl:
    process.env.DATABASE_URL || 'postgresql://hww_user:hww_password@localhost:5432/hww_app?schema=public',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
