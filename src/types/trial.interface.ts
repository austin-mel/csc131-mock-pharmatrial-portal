import type { BadgeStatus, PatientInformation } from "@/types";

export interface Trial {
    name: string;

    id: string;

    drug_id: PatientInformation['id'];
    
    status: BadgeStatus;

    approvals: {
      jh: boolean;
      fda: boolean;
      bav: boolean;
      [key: string]: boolean;
    };

    active: boolean;

    completed: boolean;

    rejected: boolean;
  }