import { get, ref } from 'firebase/database';
import { getTranslations } from 'next-intl/server';
import User from '@/components/User';
import { generateAlternates } from '@/utils/alternates';
import { db } from '@/utils/firebase';
import { generatePageMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }) {
  const { id } = await Promise.resolve(params);
  const t = await getTranslations('metadata');
  const alternates = generateAlternates(`/user/${id}`);

  let userName = 'User';

  if (db) {
    const userRef = ref(db, `users/${id}`);
    const snapshot = await get(userRef);
    userName = snapshot.val()?.name || userName;
  }

  return generatePageMetadata({
    title: t('user.title', { userName }),
    description: t('user.description', { userName }),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  });
}

export default async function UserProfilePage({ params }) {
  const { id } = await Promise.resolve(params);

  return <User id={id} />;
}
