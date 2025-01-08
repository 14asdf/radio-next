import { generatePageMetadata } from '@/utils/metadata';
import Profile from '@/components/Profile';
import { useTranslations } from 'next-intl';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'metadata.profile.title',
    description: 'metadata.profile.description',
  });
}

export default function ProfilePage() {
  return <Profile />;
}
