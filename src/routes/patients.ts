// src/routes/patients.ts
import { Router } from 'express';
import {
  getAllPatients,
  getPatientById,
} from '../controllers/patient.controller';

const router = Router();

router.get('/', getAllPatients);
router.get('/:id', getPatientById);

export default router;
