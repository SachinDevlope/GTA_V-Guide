import type { Business } from '@/features/online/types';
import { tierRating } from './tierRating';
import type { Rating } from './types';

/** Businesses are rated from their money-making tier; pros and cons come from the research data. */
export function businessRating(b: Business): Rating | null {
  return tierRating(b, 'money maker');
}
