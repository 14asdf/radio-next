import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import Trends from '@/components/Trends';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ searchParams }) {
  const t = await getTranslations('metadata');
  const alternates = generateAlternates('/trends');

  return generatePageMetadata({
    title: t('trends.title'),
    description: t('trends.description'),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  });
}

export default function TrendsPage() {
  return <Trends />;
}
