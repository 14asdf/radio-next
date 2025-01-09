import { generatePageMetadata } from '@/utils/metadata';
import User from '@/components/User';
import { ref, get } from 'firebase/database';
import { db } from '@/utils/firebase';
import { getTranslations } from 'next-intl/server';
import { generateAlternates } from '@/utils/alternates';

export async function generateMetadata({ params }) {
  const { id } = await Promise.resolve(params);
  const t = await getTranslations('metadata');

  console.log(id);
  // Fetch user data from Firebase RTDB
  const userRef = ref(db, `users/${id}`);
  const snapshot = await get(userRef);
  const userData = snapshot.val();
  const userName = userData?.name || 'User';

  return generatePageMetadata({
    title: t('user.title', { userName }),
    description: t('user.description', { userName }),
    alternates: generateAlternates(`/user/${id}`),
  });
}

export default async function UserProfilePage({ params }) {
  const { id } = await Promise.resolve(params);

  return <User id={id} />;
}
