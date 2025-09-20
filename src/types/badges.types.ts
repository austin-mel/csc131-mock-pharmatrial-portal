export const BadgeStatus = [
    'active',
    'pending',
    'completed',
    'rejected',
] as const;

export type BadgeStatus = typeof BadgeStatus[number];