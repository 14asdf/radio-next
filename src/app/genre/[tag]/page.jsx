import { generatePageMetadata } from '@/utils/metadata';
import Genre from '@/components/Genres';
import { getTranslations } from 'next-intl/server';
import { generateAlternates } from '@/utils/alternates';

export async function generateMetadata({ params }) {
  const { tag } = params;
  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  const t = await getTranslations('metadata.genre');
  const alternates = generateAlternates(`/genre/${tag}`);

  return generatePageMetadata({
    title: t('title', { genre: formattedTag }),
    description: t('description', { genre: formattedTag.toLowerCase() }),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  });
}

export default function GenrePage() {
  return <Genre />;
}
