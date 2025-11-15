import { Router } from "express";
import * as trialController from "../controllers/trial.controller";
import { validate } from "../middleware/validate";
import { CreateTrialSchema, UpdateTrialSchema } from "../validators/trial.validator";

const router = Router();

// Get all trials
router.get("/", trialController.getTrials);

// Get trial by ID
router.get("/:id", trialController.getTrialById);

// Create trial
router.post("/", validate(CreateTrialSchema), trialController.createTrial);

// Update tiral
router.patch("/:id", validate(UpdateTrialSchema), trialController.updateTrial);

// Delete trial
router.delete("/:id", trialController.deleteTrial);

export default router;
