import { Router } from 'express';
import { createFeature, listFeatures, toggleFeature } from '../controllers/featureController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, listFeatures);
router.post('/', authRequired, createFeature);
router.patch('/:id/toggle', authRequired, toggleFeature);

export default router;
