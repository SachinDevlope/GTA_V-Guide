import {
  Activity,
  Briefcase,
  Building2,
  Car,
  Crosshair,
  Gamepad2,
  Gem,
  Landmark,
  Map as MapIcon,
  Target,
  Users,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';
import type { CategoryKey } from '../types';

export const CATEGORY_ICONS: Record<CategoryKey | 'map', LucideIcon> = {
  missions: Target,
  heists: Landmark,
  'online-missions': Briefcase,
  businesses: Building2,
  vehicles: Car,
  weapons: Crosshair,
  characters: Users,
  cheats: Gamepad2,
  skills: Activity,
  collectibles: Gem,
  map: MapIcon,
};

export function CategoryIcon({ cat, ...props }: { cat: CategoryKey | 'map' } & LucideProps) {
  const Icon = CATEGORY_ICONS[cat];
  return <Icon aria-hidden="true" strokeWidth={1.75} {...props} />;
}
