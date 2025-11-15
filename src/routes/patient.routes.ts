import { Router } from "express";
import * as patientController from "../controllers/patient.controller";
import { validate } from "../middleware/validate";
import { createPatientSchema, updatePatientSchema } from "../validators/patient.validator";

const router = Router();

// Get all patients
router.get("/", patientController.getPatients);

// Get patients by id
router.get("/:id", patientController.getPatientById);

// Create patient
router.post("/", validate(createPatientSchema), patientController.createPatient);

// Update patient
router.patch("/:id", validate(updatePatientSchema), patientController.updatePatient);

// Delete patient
router.delete("/:id", patientController.deletePatient);

export default router;