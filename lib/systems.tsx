import { ReactNode } from 'react';
import {
  BatteryCharging,
  Waves,
  ShieldCheck,
  Anchor,
  Sun,
  Bell,
} from 'lucide-react';
import { theme } from './theme';

export type SystemKey =
  | 'energy'
  | 'tanks'
  | 'security'
  | 'anchor'
  | 'environment'
  | 'alerts';

export interface SystemDef {
  key: SystemKey;
  label: string;
  color: string; // акцент точки
  icon: ReactNode;
  hotspot: [number, number, number]; // XYZ в координатах модели (метры/нормал)
}

export const SYSTEMS: SystemDef[] = [
  {
    key: 'energy',
    label: 'Energy',
    color: theme.colors.system.energy,
    icon: <BatteryCharging size={16} />,
    hotspot: [-0.15, 0.05, 0.0],
  },
  {
    key: 'tanks',
    label: 'Tanks',
    color: theme.colors.system.tanks,
    icon: <Waves size={16} />,
    hotspot: [0.0, -0.08, 0.02],
  },
  {
    key: 'security',
    label: 'Security',
    color: theme.colors.system.security,
    icon: <ShieldCheck size={16} />,
    hotspot: [0.3, 0.2, 0.1],
  },
  {
    key: 'anchor',
    label: 'Anchor',
    color: theme.colors.system.anchor,
    icon: <Anchor size={16} />,
    hotspot: [0.55, 0.05, -0.15],
  },
  {
    key: 'environment',
    label: 'Environment',
    color: theme.colors.system.environment,
    icon: <Sun size={16} />,
    hotspot: [-0.4, 0.25, 0.05],
  },
  {
    key: 'alerts',
    label: 'Alerts',
    color: theme.colors.system.alerts,
    icon: <Bell size={16} />,
    hotspot: [0.0, 0.3, 0.0],
  },
];
