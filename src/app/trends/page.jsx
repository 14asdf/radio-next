import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import Trends from '@/components/Trends';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ searchParams }) {
  const t = await getTranslations();
  const alternates = generateAlternates('/trends');

  return {
    title: t('metadata.trends.title'),
    description: t('metadata.trends.description'),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  };
}

export default function TrendsPage() {
  return <Trends />;
}
