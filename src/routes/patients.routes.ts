import { Router } from 'express';
import * as patientController from '../controllers/patient.controller';

const router = Router();

router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatientById);

export default router;
