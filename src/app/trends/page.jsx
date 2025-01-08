import { generatePageMetadata } from '@/utils/metadata';
import Trends from '@/components/Trends';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();
  return generatePageMetadata({
    title: t('metadata.trends.title'),
    description: t('metadata.trends.description'),
  });
}

export default function TrendsPage() {
  return <Trends />;
}
