import type { BadgeStatus, PatientInformation } from "@/types";

export interface Trial {
    trial: {};
    name: string;

    id: string;

    drug_id: string;
    
    status: BadgeStatus;

    approvals: {
      JHDoctor: boolean;
      FDA: boolean;
      Bavaria: boolean;
      [key: string]: boolean;
    };

    distributed: {
      JHDoctor: boolean
      FDA: boolean
      Bavaria: boolean
    };

    active: boolean;

    completed: boolean;

    rejected: boolean;
  }
