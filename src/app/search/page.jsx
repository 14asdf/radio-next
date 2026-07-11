import { getTranslations } from 'next-intl/server';
import Search from '@/components/Search';
import { generateAlternates } from '@/utils/alternates';
import { generatePageMetadata } from '@/utils/metadata';

export async function generateMetadata() {
  const t = await getTranslations();
  const alternates = generateAlternates('/search');

  return generatePageMetadata({
    title: t('metadata.search.title'),
    description: t('metadata.search.description'),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  });
}

export default function SearchPage() {
  return <Search />;
}
