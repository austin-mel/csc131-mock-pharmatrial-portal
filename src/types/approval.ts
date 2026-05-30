export type ApprovalStatus = 'approved' | 'pending' | 'rejected' | 'blocked';

export interface TrialApprovals {
  jh: ApprovalStatus;
  fda: ApprovalStatus;
}
