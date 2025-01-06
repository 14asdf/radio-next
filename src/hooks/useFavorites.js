import { ref, update, get } from 'firebase/database';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useFavorites() {
  const { user } = useAuth();

  const toggleFavorite = async (stationId) => {
    if (!user || !stationId) {
      console.log('Toggle favorite failed:', { user, stationId });
      return;
    }

    const favoritesRef = ref(db, `favorites/${user.uid}`);

    try {
      const snapshot = await get(favoritesRef);
      let currentFavorites = snapshot.val()?.favorites || [];
      console.log('Current favorites:', currentFavorites);

      // Ensure currentFavorites is always an array
      if (!Array.isArray(currentFavorites)) {
        currentFavorites = [];
      }

      const newFavorites = currentFavorites.includes(stationId)
        ? currentFavorites.filter((id) => id !== stationId)
        : [...currentFavorites, stationId];

      console.log('New favorites array:', newFavorites);

      // Create a proper object structure for the update
      const updateData = {
        favorites: newFavorites.length > 0 ? newFavorites : null, // Prevent empty array issues
      };

      // Update the database with the new structure
      await update(favoritesRef, updateData);

      console.log('Update successful');

      // Verify the update
      const verifySnapshot = await get(favoritesRef);
      console.log('Updated favorites in DB:', verifySnapshot.val());
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      throw error;
    }
  };

  const getFavorites = async () => {
    if (!user) return [];

    const favoritesRef = ref(db, `favorites/${user.uid}`);
    const snapshot = await get(favoritesRef);
    const favorites = snapshot.val()?.favorites || [];

    return Array.isArray(favorites) ? favorites : [];
  };

  return { toggleFavorite, getFavorites };
}
