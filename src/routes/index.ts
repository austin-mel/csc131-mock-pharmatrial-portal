import { Router } from 'express';
import authRoutes from './auth.routes';
import workflowRoutes from './workflow.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/workflow', workflowRoutes);
router.use('/trials', workflowRoutes);

export default router;
