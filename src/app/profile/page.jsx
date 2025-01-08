import { generatePageMetadata } from '@/utils/metadata';
import Profile from '@/components/Profile';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'My Profile',
    description:
      'Manage your Radio Cloud profile, view your favorite stations, and customize your radio listening experience.',
  });
}

export default function ProfilePage() {
  return <Profile />;
}
