export type PortalId = 'jh-doctor' | 'jh-admin' | 'fda' | 'bavaria';

export interface Portal {
  id: PortalId;
  label: string;
  role: string;
  color: string;
  tint: string;
  abbr: string;
  user: string;
  logo: string;
}
