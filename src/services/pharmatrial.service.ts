import { prisma } from '../prisma/client';
import { PortalRole } from '../middleware/auth';

type ApprovalStatus = 'approved' | 'pending' | 'rejected' | 'blocked';

interface TrialRecord {
  id: string;
  name: string;
  drug: string;
  phase: string;
  condition: string;
  start: Date;
  end: Date;
  enrollmentTarget: number;
  status: 'pending-approval' | 'active' | 'rejected' | 'complete';
  statusLabel?: string | null;
  archived: boolean;
  createdAt: Date;
  approvals: { jh: ApprovalStatus; fda: ApprovalStatus };
  batchSubmitted: boolean;
  assignmentsLocked: boolean;
  notifiedFDA: boolean;
  disclosed: boolean;
  dosesPerPatient: number;
  description?: string | null;
  eligibility?: unknown;
  batch?: any;
  enrollments?: any[];
  assignments?: any[];
  reports?: any[];
}

function dateOnly(value: Date | string | null | undefined) {
  if (!value) return undefined;
  return new Date(value).toISOString().slice(0, 10);
}

function includeGraph() {
  return {
    batch: true,
    assignments: true,
    reports: true,
    enrollments: {
      include: {
        patient: true,
        appointments: true,
        assignment: true,
      },
    },
  };
}

function approvalsFor(trial: TrialRecord) {
  return {
    jh: trial.approvals?.jh ?? 'blocked',
    fda: trial.approvals?.fda ?? 'pending',
  };
}

export function trialStatusLabel(trial: TrialRecord) {
  const approvals = approvalsFor(trial);

  if (trial.status === 'complete' && trial.disclosed && trial.notifiedFDA) return 'Completed';
  if (trial.status === 'rejected') return 'Rejected';
  if (trial.status === 'pending-approval') {
    if (approvals.fda === 'pending') return 'Pending FDA Approval';
    if (approvals.fda === 'approved' && approvals.jh === 'pending') return 'Pending JH Approval';
    if (approvals.fda === 'approved' && approvals.jh === 'blocked') return 'Awaiting JH Approval';
    if (approvals.fda === 'approved' && approvals.jh === 'approved') {
      return trial.batchSubmitted ? 'Approved - Awaiting Assignments' : 'Approved - Awaiting Batch';
    }
  }
  if (trial.notifiedFDA && !trial.disclosed) return 'Awaiting FDA Report';
  if (trial.assignmentsLocked && trial.status === 'active') return 'Active';
  return trial.statusLabel || 'In Review';
}

function canPortalViewTrial(trial: TrialRecord, portalId: PortalRole) {
  if (portalId !== 'jh-doctor') return true;
  return trial.status === 'active' || (trial.status === 'complete' && trial.disclosed && trial.notifiedFDA);
}

function canSeePii(portalId: PortalRole) {
  return portalId === 'jh-doctor' || portalId === 'jh-admin';
}

function canSeeAssignment(trial: TrialRecord, portalId: PortalRole) {
  return portalId === 'fda' || Boolean(trial.disclosed);
}

function patientDto(patient: any, portalId: PortalRole) {
  if (canSeePii(portalId)) {
    return {
      id: patient.id,
      name: patient.name,
      dob: dateOnly(patient.dob),
      icdCodes: patient.icdCodes ?? [],
      bloodType: patient.bloodType,
      bp: patient.bp,
      oxygen: patient.oxygen,
      meds: patient.meds,
      allergy: patient.allergy,
      height: patient.height,
      weight: patient.weight,
      address: patient.address,
      insuranceId: patient.insuranceId,
      employment: patient.employment,
      temperature: patient.temperature,
    };
  }

  return {
    id: patient.id,
    name: `Patient ${String(patient.id).slice(-4).toUpperCase()}`,
    dob: '',
    icdCodes: patient.icdCodes ?? [],
    bloodType: patient.bloodType,
    bp: patient.bp,
    oxygen: patient.oxygen,
    meds: patient.meds,
    allergy: patient.allergy,
    height: patient.height,
    weight: patient.weight,
    employment: patient.employment,
    temperature: patient.temperature,
  };
}

function appointmentDto(appointment: any) {
  return {
    date: dateOnly(appointment.date),
    time: appointment.time ?? undefined,
    type: appointment.type,
    dose: appointment.dose,
    bloodTestLevel: appointment.bloodTestLevel ?? null,
    adverseEvents: appointment.adverseEvents ?? [],
    note: appointment.note,
  };
}

function trialDto(trial: TrialRecord, portalId: PortalRole) {
  const batch = trial.batch;
  return {
    id: trial.id,
    name: trial.name,
    drug: trial.drug,
    phase: trial.phase,
    condition: trial.condition,
    start: dateOnly(trial.start),
    end: dateOnly(trial.end),
    enrollment: trial.enrollmentTarget,
    status: trial.status,
    statusLabel: trialStatusLabel(trial),
    archived: trial.archived,
    created: dateOnly(trial.createdAt),
    approvals: approvalsFor(trial),
    batchSubmitted: trial.batchSubmitted,
    assignmentsLocked: trial.assignmentsLocked,
    notifiedFDA: trial.notifiedFDA,
    disclosed: trial.disclosed,
    batchRef: batch?.batchRef,
    treatmentPct: batch?.treatmentPct,
    manufactureDate: dateOnly(batch?.manufactureDate),
    lotNumber: batch?.lotNumber,
    shippingNotes: batch?.shippingNotes,
    dosesPerPatient: trial.dosesPerPatient,
    description: trial.description ?? undefined,
    eligibility: trial.eligibility ?? null,
  };
}

function enrollmentMap(trial: TrialRecord) {
  return Object.fromEntries(
    (trial.enrollments ?? []).map((enrollment) => [
      enrollment.patientId,
      {
        eligible: enrollment.eligible,
        doses: enrollment.doses,
        appointments: (enrollment.appointments ?? []).map(appointmentDto),
      },
    ]),
  );
}

function assignmentMap(trial: TrialRecord, portalId: PortalRole) {
  if (!canSeeAssignment(trial, portalId)) return {};

  return Object.fromEntries(
    (trial.assignments ?? []).map((assignment) => [
      assignment.patientId,
      {
        patientId: assignment.patientId,
        drug: assignment.drug,
        trackingId: assignment.trackingId,
      },
    ]),
  );
}

function allEligibleDosed(trial: TrialRecord) {
  const eligible = (trial.enrollments ?? []).filter((enrollment) => enrollment.eligible);
  return eligible.length > 0 && eligible.every((enrollment) => enrollment.doses >= trial.dosesPerPatient);
}

async function audit(actor: { id: string; portalId: PortalRole }, action: string, trialId: string, metadata?: unknown) {
  await (prisma as any).auditEvent.create({
    data: {
      actorId: actor.id.startsWith('demo-') ? null : actor.id,
      actorRole: actor.portalId,
      action,
      entityId: trialId,
      entityType: 'trial',
      metadata: metadata ?? undefined,
    },
  });
}

export async function snapshot(portalId: PortalRole) {
  const records = (await (prisma as any).trial.findMany({
    include: includeGraph(),
    orderBy: { createdAt: 'desc' },
  })) as TrialRecord[];
  const visibleTrials = records.filter((trial) => canPortalViewTrial(trial, portalId));
  const patientPairs = visibleTrials.flatMap((trial) =>
    (trial.enrollments ?? []).map((enrollment) => [enrollment.patientId, patientDto(enrollment.patient, portalId)]),
  );

  return {
    trials: visibleTrials.map((trial) => trialDto(trial, portalId)),
    patients: Array.from(new Map(patientPairs).values()),
    trialPatients: Object.fromEntries(visibleTrials.map((trial) => [trial.id, enrollmentMap(trial)])),
    assignments: Object.fromEntries(visibleTrials.map((trial) => [trial.id, assignmentMap(trial, portalId)])),
    reports: Object.fromEntries(visibleTrials.map((trial) => [trial.id, trial.reports?.[0]?.rows ?? []])),
  };
}

export async function createTrial(actor: { id: string; portalId: PortalRole }, draft: any) {
  if (actor.portalId !== 'bavaria') throw Object.assign(new Error('Only Bavaria can create trials'), { status: 403 });

  const trial = await (prisma as any).trial.create({
    data: {
      name: draft.name,
      drug: draft.drug,
      phase: draft.phase,
      condition: draft.condition || '-',
      start: new Date(draft.start),
      end: new Date(draft.end),
      enrollmentTarget: Number(draft.enrollment),
      status: 'pending-approval',
      statusLabel: 'Pending Approval',
      approvals: { jh: 'blocked', fda: 'pending' },
      dosesPerPatient: Number(draft.dosesPerPatient || 1),
      description: draft.description || 'No description provided.',
      eligibility: null,
    },
    include: includeGraph(),
  });
  await audit(actor, 'trial.create', trial.id);
  return trialDto(trial, actor.portalId);
}

export async function approveTrial(actor: { id: string; portalId: PortalRole }, trialId: string, eligibility?: unknown) {
  const trial = (await (prisma as any).trial.findUnique({
    where: { id: trialId },
    include: includeGraph(),
  })) as TrialRecord | null;
  if (!trial || trial.status === 'rejected') throw Object.assign(new Error('Trial not available'), { status: 404 });

  const approvals = approvalsFor(trial);
  if (actor.portalId === 'fda' && approvals.fda === 'pending') {
    approvals.fda = 'approved';
    if (approvals.jh === 'blocked') approvals.jh = 'pending';
  } else if (actor.portalId === 'jh-admin' && approvals.jh === 'pending') {
    if (!(trial.enrollments ?? []).length) {
      throw Object.assign(new Error('JH approval requires enrolled patients'), { status: 409 });
    }
    approvals.jh = 'approved';
  } else {
    throw Object.assign(new Error('Approval gate is closed for this role'), { status: 403 });
  }

  await (prisma as any).trial.update({
    where: { id: trialId },
    data: { approvals, eligibility: actor.portalId === 'fda' ? eligibility ?? trial.eligibility : trial.eligibility },
    include: includeGraph(),
  });
  await audit(actor, 'trial.approve', trialId);
  return snapshot(actor.portalId);
}

export async function rejectTrial(actor: { id: string; portalId: PortalRole }, trialId: string) {
  const trial = (await (prisma as any).trial.findUnique({ where: { id: trialId } })) as TrialRecord | null;
  if (!trial || trial.status === 'rejected') throw Object.assign(new Error('Trial not available'), { status: 404 });

  const approvals = approvalsFor(trial);
  if (actor.portalId === 'fda' && approvals.fda === 'pending') approvals.fda = 'rejected';
  else if (actor.portalId === 'jh-admin' && approvals.jh === 'pending') approvals.jh = 'rejected';
  else throw Object.assign(new Error('Reject gate is closed for this role'), { status: 403 });

  await (prisma as any).trial.update({
    where: { id: trialId },
    data: { approvals, status: 'rejected', statusLabel: 'Rejected' },
    include: includeGraph(),
  });
  await audit(actor, 'trial.reject', trialId);
  return snapshot(actor.portalId);
}

export async function upsertEnrollment(actor: { id: string; portalId: PortalRole }, trialId: string, patient: any, eligible: boolean) {
  if (actor.portalId !== 'jh-doctor' && actor.portalId !== 'jh-admin') {
    throw Object.assign(new Error('Only Jane Hopkins roles can enroll patients'), { status: 403 });
  }

  const trial = (await (prisma as any).trial.findUnique({ where: { id: trialId } })) as TrialRecord | null;
  if (!trial || trial.status === 'rejected' || trial.notifiedFDA) {
    throw Object.assign(new Error('Patient enrollment is closed'), { status: 409 });
  }

  const savedPatient = await (prisma as any).patient.upsert({
    where: { id: patient.id },
    update: patient,
    create: patient,
  });
  await (prisma as any).enrollment.upsert({
    where: { trialId_patientId: { trialId, patientId: savedPatient.id } },
    update: { eligible },
    create: { trialId, patientId: savedPatient.id, eligible, doses: 0 },
  });
  await audit(actor, 'patient.enroll', trialId, { patientId: savedPatient.id });
  return snapshot(actor.portalId);
}

export async function logAppointment(actor: { id: string; portalId: PortalRole }, trialId: string, patientId: string, draft: any) {
  if (actor.portalId !== 'jh-doctor') throw Object.assign(new Error('Only JH Doctor can log appointments'), { status: 403 });

  const trial = (await (prisma as any).trial.findUnique({
    where: { id: trialId },
    include: includeGraph(),
  })) as TrialRecord | null;
  const enrollment = trial?.enrollments?.find((item) => item.patientId === patientId);
  if (!trial || trial.status === 'rejected' || !enrollment?.eligible) {
    throw Object.assign(new Error('Appointment gate is closed'), { status: 409 });
  }

  const dose = draft.type === 'Dose Administration';
  const canIncrementDose = dose && enrollment.doses < trial.dosesPerPatient;
  await (prisma as any).appointment.create({
    data: {
      enrollmentId: enrollment.id,
      date: new Date(draft.date),
      time: draft.time,
      type: draft.type,
      dose,
      bloodTestLevel: draft.bloodTestLevel,
      adverseEvents: draft.adverseEvents ?? [],
      note: draft.note ?? '',
    },
  });
  if (canIncrementDose) {
    await (prisma as any).enrollment.update({
      where: { id: enrollment.id },
      data: { doses: { increment: 1 } },
    });
  }
  await audit(actor, dose ? 'dose.log' : 'appointment.create', trialId, { patientId });
  return snapshot(actor.portalId);
}

export async function submitBatch(actor: { id: string; portalId: PortalRole }, trialId: string, draft: any) {
  if (actor.portalId !== 'bavaria') throw Object.assign(new Error('Only Bavaria can submit batches'), { status: 403 });
  const trial = (await (prisma as any).trial.findUnique({ where: { id: trialId } })) as TrialRecord | null;
  const approvals = trial ? approvalsFor(trial) : null;
  if (!trial || trial.status === 'rejected' || approvals?.fda !== 'approved' || approvals?.jh !== 'approved') {
    throw Object.assign(new Error('Batch submission gate is closed'), { status: 409 });
  }
  if (!Number.isFinite(draft.treatmentPct) || draft.treatmentPct < 10 || draft.treatmentPct > 90) {
    throw Object.assign(new Error('Treatment percentage must be between 10 and 90'), { status: 400 });
  }

  await (prisma as any).batch.upsert({
    where: { trialId },
    update: {
      batchRef: draft.batchRef,
      treatmentPct: draft.treatmentPct,
      manufactureDate: draft.manufactureDate ? new Date(draft.manufactureDate) : null,
      lotNumber: draft.lotNumber,
      shippingNotes: draft.shippingNotes,
    },
    create: {
      trialId,
      batchRef: draft.batchRef,
      treatmentPct: draft.treatmentPct,
      manufactureDate: draft.manufactureDate ? new Date(draft.manufactureDate) : null,
      lotNumber: draft.lotNumber,
      shippingNotes: draft.shippingNotes,
    },
  });
  await (prisma as any).assignment.deleteMany({ where: { trialId } });
  await (prisma as any).trial.update({
    where: { id: trialId },
    data: { batchSubmitted: true, assignmentsLocked: false },
  });
  await audit(actor, 'trial.submit_batch', trialId);
  return snapshot(actor.portalId);
}

export async function saveAssignments(actor: { id: string; portalId: PortalRole }, trialId: string, draft: Record<string, any>) {
  if (actor.portalId !== 'fda') throw Object.assign(new Error('Only FDA can assign treatments'), { status: 403 });
  const trial = (await (prisma as any).trial.findUnique({
    where: { id: trialId },
    include: includeGraph(),
  })) as TrialRecord | null;
  const eligible = (trial?.enrollments ?? []).filter((enrollment) => enrollment.eligible);
  if (!trial || trial.status === 'rejected' || !trial.batchSubmitted || eligible.length === 0) {
    throw Object.assign(new Error('Assignment gate is closed'), { status: 409 });
  }
  if (!eligible.every((enrollment) => draft[enrollment.patientId]?.patientId === enrollment.patientId)) {
    throw Object.assign(new Error('Every eligible patient requires one assignment'), { status: 400 });
  }

  await (prisma as any).assignment.deleteMany({ where: { trialId } });
  await (prisma as any).assignment.createMany({
    data: eligible.map((enrollment) => ({
      trialId,
      enrollmentId: enrollment.id,
      patientId: enrollment.patientId,
      drug: draft[enrollment.patientId].drug,
      trackingId: draft[enrollment.patientId].trackingId,
    })),
  });
  await (prisma as any).trial.update({
    where: { id: trialId },
    data: { assignmentsLocked: true, status: 'active', statusLabel: 'Active' },
  });
  await audit(actor, 'trial.lock_assignments', trialId);
  return snapshot(actor.portalId);
}

export async function notifyFda(actor: { id: string; portalId: PortalRole }, trialId: string) {
  if (actor.portalId !== 'jh-admin') throw Object.assign(new Error('Only JH Admin can notify FDA'), { status: 403 });
  const trial = (await (prisma as any).trial.findUnique({
    where: { id: trialId },
    include: includeGraph(),
  })) as TrialRecord | null;
  if (!trial || trial.status !== 'active' || !trial.assignmentsLocked || !allEligibleDosed(trial) || trial.notifiedFDA) {
    throw Object.assign(new Error('FDA notification gate is closed'), { status: 409 });
  }

  await (prisma as any).trial.update({ where: { id: trialId }, data: { notifiedFDA: true } });
  await audit(actor, 'trial.notify_fda', trialId);
  return snapshot(actor.portalId);
}

export async function discloseTrial(actor: { id: string; portalId: PortalRole }, trialId: string, reportRows: unknown[] = []) {
  if (actor.portalId !== 'fda') throw Object.assign(new Error('Only FDA can disclose reports'), { status: 403 });
  const trial = (await (prisma as any).trial.findUnique({
    where: { id: trialId },
    include: includeGraph(),
  })) as TrialRecord | null;
  if (!trial || !trial.notifiedFDA || !trial.assignmentsLocked || !allEligibleDosed(trial) || trial.disclosed) {
    throw Object.assign(new Error('Disclosure gate is closed'), { status: 409 });
  }

  await (prisma as any).trial.update({
    where: { id: trialId },
    data: { disclosed: true, status: 'complete', statusLabel: 'Complete' },
  });
  await (prisma as any).trialReport.create({ data: { trialId, rows: reportRows } });
  await audit(actor, 'trial.disclose_report', trialId);
  return snapshot(actor.portalId);
}

export async function archiveTrial(actor: { id: string; portalId: PortalRole }, trialId: string, archived: boolean) {
  if (actor.portalId !== 'bavaria') throw Object.assign(new Error('Only Bavaria can archive trials'), { status: 403 });
  const trial = (await (prisma as any).trial.findUnique({ where: { id: trialId } })) as TrialRecord | null;
  if (!trial || (trial.status !== 'complete' && trial.status !== 'rejected')) {
    throw Object.assign(new Error('Archive gate is closed'), { status: 409 });
  }
  await (prisma as any).trial.update({ where: { id: trialId }, data: { archived } });
  await audit(actor, archived ? 'trial.archive' : 'trial.unarchive', trialId);
  return snapshot(actor.portalId);
}

export async function deleteTrial(actor: { id: string; portalId: PortalRole }, trialId: string) {
  if (actor.portalId !== 'bavaria') throw Object.assign(new Error('Only Bavaria can delete archived rejected trials'), { status: 403 });
  const trial = (await (prisma as any).trial.findUnique({ where: { id: trialId } })) as TrialRecord | null;
  if (!trial || trial.status !== 'rejected' || !trial.archived) {
    throw Object.assign(new Error('Delete gate is closed'), { status: 409 });
  }
  await audit(actor, 'trial.delete', trialId);
  await (prisma as any).trial.delete({ where: { id: trialId } });
  return { deleted: trialId };
}
