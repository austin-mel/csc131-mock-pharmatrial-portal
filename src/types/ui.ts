import type { TrialTab } from './trial';

export type ModalId =
  | 'create-trial'
  | 'approval'
  | 'patient-detail'
  | 'patient-form'
  | 'patient-csv'
  | 'appointment-form'
  | 'drug-batch'
  | 'fda-assignment'
  | 'notify-fda'
  | 'disclose-trial'
  | 'report';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ToastRecord = Toast;

export interface UiState {
  activeTab: TrialTab;
  openModal: ModalId | null;
  selectedPatientId: string | null;
  toasts: Toast[];
}
