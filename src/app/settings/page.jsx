import { getTranslations } from 'next-intl/server';
import Settings from '@/components/Settings';
import { generateAlternates } from '@/utils/alternates';
import { generatePageMetadata } from '@/utils/metadata';

export async function generateMetadata() {
  const t = await getTranslations('metadata');
  const alternates = generateAlternates('/settings');

  return generatePageMetadata({
    title: t('settings.title'),
    description: t('settings.description'),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  });
}

export default function SettingsPage() {
  return <Settings />;
}
