import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/errors.js';
import { isPositiveInt } from '../utils/http.js';

const buildOwnerFilter = (user) => (user.role === 'admin' ? {} : { ownerId: user.userId });

const createFeatureSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().default(''),
  enabled: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .default(false)
    .transform((value) => value === true || value === 'true')
});

export const listFeatures = async (req, res) => {
  const features = await prisma.feature.findMany({
    where: buildOwnerFilter(req.user),
    orderBy: { createdAt: 'desc' }
  });
  return res.json(features);
};

export const createFeature = async (req, res) => {
  const parsed = createFeatureSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.errors[0]?.message || 'Invalid feature payload');
  }

  const { title, description, enabled } = parsed.data;
  const created = await prisma.feature.create({
    data: {
      title,
      description,
      enabled,
      ownerId: req.user.userId
    }
  });

  return res.status(201).json(created);
};

export const toggleFeature = async (req, res) => {
  const id = Number(req.params.id);
  if (!isPositiveInt(id)) {
    throw new HttpError(400, 'Invalid feature id');
  }

  const where = req.user.role === 'admin' ? { id } : { id, ownerId: req.user.userId };
  const current = await prisma.feature.findFirst({ where });
  if (!current) {
    throw new HttpError(404, 'Feature not found');
  }

  const updated = await prisma.feature.update({
    where: { id: current.id },
    data: { enabled: !current.enabled }
  });

  return res.json(updated);
};
