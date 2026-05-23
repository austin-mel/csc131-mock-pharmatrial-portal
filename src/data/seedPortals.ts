import type { Portal } from '@/types';
import { FDALogo, MiniBavariaLogo, MiniJHLogo } from '@/assets';

export const seedPortals: Portal[] = [
  { id: 'jh-doctor', label: 'Jane Hopkins Doctor', role: 'Trial Physician', color: '#1e7e4e', tint: '#e6f4ec', abbr: 'DR', user: 'Dr. Sarah Chen', logo: MiniJHLogo },
  { id: 'jh-admin', label: 'Jane Hopkins Admin', role: 'Admin Coordinator', color: '#1e7e4e', tint: '#e6f4ec', abbr: 'JA', user: 'Emily Rodriguez', logo: MiniJHLogo },
  { id: 'fda', label: 'FDA Admin', role: 'Federal Regulator', color: '#2a5c8f', tint: '#e8eef5', abbr: 'FDA', user: 'Michael Torres', logo: FDALogo },
  { id: 'bavaria', label: 'Bavaria Admin', role: 'Pharmaceutical Co.', color: '#c0392b', tint: '#fdf0ee', abbr: 'BV', user: 'Anna Keller', logo: MiniBavariaLogo },
];
