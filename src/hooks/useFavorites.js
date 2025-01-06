import { ref, update, get } from 'firebase/database';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useFavorites() {
  const { user } = useAuth();

  const toggleFavorite = async (stationId) => {
    if (!user) return;

    const favoritesRef = ref(db, `users/${user.uid}/favorites`);
    const snapshot = await get(favoritesRef);
    const currentFavorites = snapshot.val() || [];

    const newFavorites = currentFavorites.includes(stationId)
      ? currentFavorites.filter((id) => id !== stationId)
      : [...currentFavorites, stationId];

    await update(ref(db, `users/${user.uid}`), {
      favorites: newFavorites,
    });
  };

  return { toggleFavorite };
}
