import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import Trends from '@/components/Trends';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();
  return generatePageMetadata({
    title: t('metadata.trends.title'),
    description: t('metadata.trends.description'),
    alternates: generateAlternates('/trends'),
  });
}

export default function TrendsPage() {
  return <Trends />;
}
