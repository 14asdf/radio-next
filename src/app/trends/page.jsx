import { generatePageMetadata } from '@/utils/metadata';
import Trends from '@/components/Trends';
import { useTranslations } from 'next-intl';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'metadata.trends.title',
    description: 'metadata.trends.description',
  });
}

export default function TrendsPage() {
  return <Trends />;
}
