/** Broad groups of vehicle classes, so searches like "boats" or "flying" find the right vehicles. */
export const VEHICLE_TYPES = [
  {
    value: 'Cars',
    classes: ['Super', 'Sports', 'Sports Classics', 'Muscle', 'Coupes', 'Sedans', 'SUVs', 'Compacts', 'Off-Road', 'Open Wheel', 'Vans'],
  },
  { value: 'Motorcycles', classes: ['Motorcycles'] },
  { value: 'Bicycles', classes: ['Cycles'] },
  { value: 'Planes', classes: ['Planes'] },
  { value: 'Helicopters', classes: ['Helicopters'] },
  { value: 'Boats', classes: ['Boats'] },
  { value: 'Emergency', classes: ['Emergency'] },
  { value: 'Military', classes: ['Military'] },
  { value: 'Work & Service', classes: ['Utility', 'Industrial', 'Commercial', 'Service'] },
] as const;

const BY_CLASS = new Map<string, string>(VEHICLE_TYPES.flatMap((t) => t.classes.map((c) => [c, t.value] as const)));

export function vehicleType(vehicleClass: string): string {
  return BY_CLASS.get(vehicleClass) ?? 'Cars';
}

/** Lets searches like "boats", "planes" or "flying" find the right vehicles. */
export function vehicleTypeKeywords(type: string): string[] {
  if (type === 'Planes' || type === 'Helicopters') return [type, 'aircraft', 'flying', 'air'];
  if (type === 'Boats') return [type, 'water', 'sea'];
  if (type === 'Motorcycles') return [type, 'bikes', 'motorbike'];
  if (type === 'Bicycles') return [type, 'cycles', 'pedal'];
  return [type];
}

