import { getTranslations } from 'next-intl/server';
import Trends from '@/components/Trends';
import { generateAlternates } from '@/utils/alternates';
import { generatePageMetadata } from '@/utils/metadata';

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
