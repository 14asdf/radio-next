import { generatePageMetadata } from '@/utils/metadata';
import User from '@/components/User';
import { ref, get } from 'firebase/database';
import { db } from '@/utils/firebase';

export async function generateMetadata({ params }) {
  const { id } = await Promise.resolve(params);

  console.log(id);
  // Fetch user data from Firebase RTDB
  const userRef = ref(db, `users/${id}`);
  const snapshot = await get(userRef);
  const userData = snapshot.val();
  const userName = userData?.name || 'User';

  return generatePageMetadata({
    title: `${userName}'s Profile`,
    description: `Check out ${userName}'s radio station collection and listening activity on Radio Cloud.`,
  });
}

export default async function UserProfilePage({ params }) {
  const { id } = await Promise.resolve(params);

  return <User id={id} />;
}
