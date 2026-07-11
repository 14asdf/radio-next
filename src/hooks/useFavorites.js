import { get, ref, update } from 'firebase/database';
import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/firebase';

export function useFavorites() {
  const { user } = useAuth();

  const toggleFavorite = useCallback(
    async (stationId) => {
      if (!user || !stationId) {
        console.log('Toggle favorite failed:', { user, stationId });
        return;
      }

      const favoritesRef = ref(db, `favorites/${user.uid}`);

      try {
        const snapshot = await get(favoritesRef);
        let currentFavorites = snapshot.val()?.favorites || [];
        console.log('Current favorites:', currentFavorites);

        if (!Array.isArray(currentFavorites)) {
          currentFavorites = [];
        }

        const newFavorites = currentFavorites.includes(stationId)
          ? currentFavorites.filter((id) => id !== stationId)
          : [...currentFavorites, stationId];

        console.log('New favorites array:', newFavorites);

        const updateData = {
          favorites: newFavorites.length > 0 ? newFavorites : null,
        };

        await update(favoritesRef, updateData);

        console.log('Update successful');

        const verifySnapshot = await get(favoritesRef);
        console.log('Updated favorites in DB:', verifySnapshot.val());
      } catch (error) {
        console.error('Error in toggleFavorite:', error);
        throw error;
      }
    },
    [user]
  );

  const getFavorites = useCallback(async () => {
    if (!user) return [];

    const favoritesRef = ref(db, `favorites/${user.uid}`);
    const snapshot = await get(favoritesRef);
    const favorites = snapshot.val()?.favorites || [];

    return Array.isArray(favorites) ? favorites : [];
  }, [user]);

  return { toggleFavorite, getFavorites };
}
