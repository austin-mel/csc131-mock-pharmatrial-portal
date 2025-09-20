import type { BadgeStatus } from "./badges.types";

export interface Trial {
    name: string;
    id: string;
    status: BadgeStatus;
  }