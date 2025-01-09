import { generatePageMetadata } from '@/utils/metadata';
import Settings from '@/components/Settings';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('metadata');

  return generatePageMetadata({
    title: t('settings.title'),
    description: t('settings.description'),
  });
}

export default function SettingsPage() {
  return <Settings />;
}
