import type { PortalId } from '@/types/portal';

export function piiVisible(portalId: PortalId): boolean {
  return portalId === 'jh-doctor';
}
