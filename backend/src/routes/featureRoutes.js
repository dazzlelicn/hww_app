import { Router } from 'express';
import { createFeature, listFeatures, toggleFeature } from '../controllers/featureController.js';
import { authRequired } from '../middleware/auth.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();

router.get('/', authRequired, asyncHandler(listFeatures));
router.post('/', authRequired, asyncHandler(createFeature));
router.patch('/:id/toggle', authRequired, asyncHandler(toggleFeature));

export default router;
