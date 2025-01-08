import { generatePageMetadata } from '@/utils/metadata';
import Profile from '@/components/Profile';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();

  return generatePageMetadata({
    title: t('metadata.profile.title'),
    description: t('metadata.profile.description'),
  });
}

export default function ProfilePage() {
  return <Profile />;
}
