export const BadgeStatus = [
    'Active',
    'Pending',
    'Completed',
    'Rejected',
] as const;

export type BadgeStatus = typeof BadgeStatus[number];