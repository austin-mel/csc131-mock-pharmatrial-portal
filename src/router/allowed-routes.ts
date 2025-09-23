export const Routes = {
  LOGIN: "Login View",
  DASHBOARD: "Dashboard View",
  ACCOUNT: "Account View",
  NOT_FOUND: "Not Found View",
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
