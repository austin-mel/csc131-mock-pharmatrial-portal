export type TrialStatus = 'pending-approval' | 'active' | 'rejected' | 'complete';

export interface Trial {
  id: string;
  name: string;
  drug: string;
  phase: string;
  condition: string;
  start: string;
  end: string;
  enrollment: number;
  status: TrialStatus;
  statusLabel: string;
  archived: boolean;
  created?: string;
  approvals?: {
    jh: 'approved' | 'pending' | 'rejected' | 'blocked';
    fda: 'approved' | 'pending' | 'rejected' | 'blocked';
  };
  batchSubmitted?: boolean;
  assignmentsLocked?: boolean;
  notifiedFDA?: boolean;
  disclosed?: boolean;
  batchRef?: string;
  dosesPerPatient: number;
  description?: string;
}
