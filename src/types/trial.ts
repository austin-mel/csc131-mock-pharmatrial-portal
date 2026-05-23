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
  dosesPerPatient: number;
  description?: string;
}
