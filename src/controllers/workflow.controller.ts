import { Request, Response } from 'express';
import * as pharmatrial from '../services/pharmatrial.service';

function actor(req: Request) {
  if (!req.user) throw Object.assign(new Error('Missing authenticated user'), { status: 401 });
  return { id: req.user.id, portalId: req.user.portalId };
}

function handleError(res: Response, error: unknown) {
  const err = error as Error & { status?: number };
  res.status(err.status ?? 500).json({ message: err.message || 'Unexpected workflow error' });
}

export async function getSnapshot(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.snapshot(actor(req).portalId));
  } catch (error) {
    handleError(res, error);
  }
}

export async function createTrial(req: Request, res: Response) {
  try {
    res.status(201).json(await pharmatrial.createTrial(actor(req), req.body));
  } catch (error) {
    handleError(res, error);
  }
}

export async function approveTrial(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.approveTrial(actor(req), req.params.id, req.body.eligibility));
  } catch (error) {
    handleError(res, error);
  }
}

export async function rejectTrial(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.rejectTrial(actor(req), req.params.id));
  } catch (error) {
    handleError(res, error);
  }
}

export async function enrollPatient(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.upsertEnrollment(actor(req), req.params.id, req.body.patient, req.body.eligible));
  } catch (error) {
    handleError(res, error);
  }
}

export async function importPatients(req: Request, res: Response) {
  try {
    let snapshot = null;
    for (const row of req.body.rows ?? []) {
      snapshot = await pharmatrial.upsertEnrollment(actor(req), req.params.id, row.patient, row.eligible);
    }
    res.json(snapshot ?? (await pharmatrial.snapshot(actor(req).portalId)));
  } catch (error) {
    handleError(res, error);
  }
}

export async function logAppointment(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.logAppointment(actor(req), req.params.id, req.body.patientId, req.body.appointment));
  } catch (error) {
    handleError(res, error);
  }
}

export async function submitBatch(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.submitBatch(actor(req), req.params.id, req.body));
  } catch (error) {
    handleError(res, error);
  }
}

export async function saveAssignments(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.saveAssignments(actor(req), req.params.id, req.body.assignments));
  } catch (error) {
    handleError(res, error);
  }
}

export async function notifyFda(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.notifyFda(actor(req), req.params.id));
  } catch (error) {
    handleError(res, error);
  }
}

export async function discloseTrial(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.discloseTrial(actor(req), req.params.id, req.body.reportRows));
  } catch (error) {
    handleError(res, error);
  }
}

export async function archiveTrial(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.archiveTrial(actor(req), req.params.id, Boolean(req.body.archived)));
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteTrial(req: Request, res: Response) {
  try {
    res.json(await pharmatrial.deleteTrial(actor(req), req.params.id));
  } catch (error) {
    handleError(res, error);
  }
}
