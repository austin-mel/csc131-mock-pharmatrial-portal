import type { AssignedDrug } from './assignment';

export type ReportGroup = 'treatment' | 'placebo';

export interface ReportRow {
  patientId: string;
  group: ReportGroup;
  assignedDrug: AssignedDrug | null;
  startValue: number | null;
  endValue: number | null;
  reductionPct: number | null;
  reductionLabel: string;
  adverseEvents: string[];
}
