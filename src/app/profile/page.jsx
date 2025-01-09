import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import Profile from '@/components/Profile';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();

  return generatePageMetadata({
    title: t('metadata.profile.title'),
    description: t('metadata.profile.description'),
    alternates: generateAlternates('/profile'),
  });
}

export default function ProfilePage() {
  return <Profile />;
}
