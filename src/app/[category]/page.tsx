import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryBrowser } from '@/features/catalog/components/CategoryBrowser';
import { getCards } from '@/features/catalog/lib/cards';
import { CATEGORY_KEYS, getCategory, isCategoryKey, toMeta } from '@/features/catalog/registry';

interface Params {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_KEYS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  if (!isCategoryKey(category)) return {};
  const def = getCategory(category);
  return { title: def.label, description: `Every GTA V ${def.label.toLowerCase()} — search, filter and sort.` };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  if (!isCategoryKey(category)) notFound();
  return <CategoryBrowser meta={toMeta(getCategory(category))} cards={getCards(category)} />;
}
