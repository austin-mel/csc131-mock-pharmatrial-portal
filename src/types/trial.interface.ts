import type { BadgeStatus } from "./badges.types";

export interface Trial {
    name: string;

    id: string;
    
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