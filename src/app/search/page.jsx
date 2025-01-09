import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import Search from '@/components/Search';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();
  return generatePageMetadata({
    title: t('metadata.search.title'),
    description: t('metadata.search.description'),
    alternates: generateAlternates('/search'),
  });
}

export default function SearchPage() {
  return <Search />;
}
