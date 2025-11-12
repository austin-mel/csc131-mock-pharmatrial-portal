// src/routes/index.ts
import { Router } from 'express';
import patientRoutes from './patients';

const router = Router();

router.use('/patients', patientRoutes);

export default router;
