import { prisma } from '../config/prisma.js';
import { isPositiveInt } from '../utils/http.js';

const buildOwnerFilter = (user) => (user.role === 'admin' ? {} : { ownerId: user.userId });

export const listFeatures = async (req, res) => {
  const features = await prisma.feature.findMany({
    where: buildOwnerFilter(req.user),
    orderBy: { createdAt: 'desc' }
  });
  return res.json(features);
};

export const createFeature = async (req, res) => {
  const { title, description, enabled } = req.body;
  const cleanTitle = title?.trim();
  if (!cleanTitle) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const created = await prisma.feature.create({
    data: {
      title: cleanTitle,
      description: description?.trim() || '',
      enabled: Boolean(enabled),
      ownerId: req.user.userId
    }
  });

  return res.status(201).json(created);
};

export const toggleFeature = async (req, res) => {
  const id = Number(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ message: 'Invalid feature id' });
  }

  const where = req.user.role === 'admin' ? { id } : { id, ownerId: req.user.userId };
  const current = await prisma.feature.findFirst({ where });
  if (!current) {
    return res.status(404).json({ message: 'Feature not found' });
  }

  const updated = await prisma.feature.update({
    where: { id: current.id },
    data: { enabled: !current.enabled }
  });

  return res.json(updated);
};
