import type { Appointment } from './appointment';
import type { TrialApprovals } from './approval';

export type TrialStatus = 'pending-approval' | 'active' | 'complete' | 'rejected';

export interface Trial {
  id: string;
  name: string;
  drug: string;
  phase: string;
  condition: string;
  created?: string;
  start: string;
  end: string;
  enrollment?: number;
  status: TrialStatus;
  archived: boolean;
  approvals: TrialApprovals;
  batchSubmitted: boolean;
  assignmentsLocked: boolean;
  notifiedFDA: boolean;
  disclosed: boolean;
  dosesPerPatient: number;
  description?: string;
  batchRef?: string;
  treatmentPct?: number;
  manufactureDate?: string;
  lotNumber?: string;
  shippingNotes?: string;
  eligibility?: TrialEligibility | null;
}

export interface TrialEligibility {
  includeIcd: string[];
  excludeIcd: string[];
  minAge: number;
  incompatMeds: string[];
}

export interface TrialEnrollment {
  eligible: boolean;
  doses: number;
  appointments: Appointment[];
}

export type TrialEnrollmentMap = Record<string, TrialEnrollment>;
export type TrialPatientsByTrial = Record<string, TrialEnrollmentMap>;

export type TrialTab =
  | 'overview'
  | 'patients'
  | 'appointments'
  | 'doses'
  | 'notify'
  | 'assignments'
  | 'disclose'
  | 'batch'
  | 'report';
