import type { BadgeStatus, PatientInformation } from "@/types";

export interface Trial {
    trial: {};
    name: string;

    id: string;

    drug_id: string;
    
    status: BadgeStatus;

    approvals: {
      jh: boolean;
      fda: boolean;
      bav: boolean;
      [key: string]: boolean;
    };

    distributed: {
      jh: boolean
      fda: boolean
      bav: boolean
    };

    active: boolean;

    completed: boolean;

    rejected: boolean;
  }
