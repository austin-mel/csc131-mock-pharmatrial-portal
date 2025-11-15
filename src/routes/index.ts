import { Router } from 'express';
import patientRoutes from './patients.routes';
import trialRoutes from './trial.routes';

const router = Router();

router.use('/patients', patientRoutes);
router.use('/trials', trialRoutes);

export default router;
