import { Router } from 'express';
import * as trialController from '../controllers/trial.controller';

const router = Router();

router.get('/', trialController.getTrials);
router.get('/:id', trialController.getTrialById);

export default router;