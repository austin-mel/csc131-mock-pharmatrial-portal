import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as workflow from '../controllers/workflow.controller';

const router = Router();

router.use(requireAuth);

router.get('/', workflow.getSnapshot);
router.get('/snapshot', workflow.getSnapshot);
router.post('/trials', workflow.createTrial);
router.post('/trials/:id/approve', workflow.approveTrial);
router.post('/trials/:id/reject', workflow.rejectTrial);
router.post('/trials/:id/enrollments', workflow.enrollPatient);
router.post('/trials/:id/import-patients', workflow.importPatients);
router.post('/trials/:id/appointments', workflow.logAppointment);
router.post('/trials/:id/doses', workflow.logAppointment);
router.post('/trials/:id/batch', workflow.submitBatch);
router.post('/trials/:id/assignments', workflow.saveAssignments);
router.post('/trials/:id/notify-fda', workflow.notifyFda);
router.post('/trials/:id/disclosure', workflow.discloseTrial);
router.post('/trials/:id/reports', workflow.discloseTrial);
router.post('/trials/:id/archive', workflow.archiveTrial);
router.delete('/trials/:id', workflow.deleteTrial);

export default router;
