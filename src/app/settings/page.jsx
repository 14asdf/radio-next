import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import Settings from '@/components/Settings';
import { getTranslations } from 'next-intl/server';

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
