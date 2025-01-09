import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import Profile from '@/components/Profile';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();
  const alternates = generateAlternates('/profile');

  return generatePageMetadata({
    title: t('metadata.profile.title'),
    description: t('metadata.profile.description'),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  });
}

export default function ProfilePage() {
  return <Profile />;
}
