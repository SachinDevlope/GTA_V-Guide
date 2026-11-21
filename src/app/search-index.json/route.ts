import { getAllCards } from '@/features/catalog/lib/cards';

// Built once at build time; the browser downloads it the first time search is used.
export const dynamic = 'force-static';

export function GET() {
  return Response.json(getAllCards());
}
