import { prisma } from '../config/prisma.js';

export const listFeatures = async (_req, res) => {
  const features = await prisma.feature.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json(features);
};

export const createFeature = async (req, res) => {
  const { title, description, enabled } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const created = await prisma.feature.create({
    data: {
      title,
      description: description || '',
      enabled: Boolean(enabled),
      ownerId: req.user.userId
    }
  });

  return res.status(201).json(created);
};

export const toggleFeature = async (req, res) => {
  const id = Number(req.params.id);
  const current = await prisma.feature.findUnique({ where: { id } });
  if (!current) {
    return res.status(404).json({ message: 'Feature not found' });
  }

  const updated = await prisma.feature.update({
    where: { id },
    data: { enabled: !current.enabled }
  });

  return res.json(updated);
};
