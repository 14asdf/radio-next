import { ref, update, get } from 'firebase/database';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useFavorites() {
  const { user } = useAuth();

  const toggleFavorite = async (stationId) => {
    console.log(stationId);
    if (!user || !stationId) return;

    const favoritesRef = ref(db, `users/${user.uid}/favorites`);
    const snapshot = await get(favoritesRef);
    let currentFavorites = snapshot.val() || [];

    // Ensure currentFavorites is always an array
    if (!Array.isArray(currentFavorites)) {
      currentFavorites = [];
    }

    const newFavorites = currentFavorites.includes(stationId)
      ? currentFavorites.filter((id) => id !== stationId)
      : [...currentFavorites, stationId];

    // Ensure all values in the array are valid
    const validFavorites = newFavorites.filter(
      (id) => id !== undefined && id !== null
    );

    try {
      await update(ref(db, `users/${user.uid}`), {
        favorites: validFavorites,
      });
    } catch (error) {
      console.error('Error updating favorites:', error);
      throw error;
    }
  };

  const getFavorites = async () => {
    if (!user) return [];

    const favoritesRef = ref(db, `users/${user.uid}/favorites`);
    const snapshot = await get(favoritesRef);
    const favorites = snapshot.val() || [];

    return Array.isArray(favorites) ? favorites : [];
  };

  return { toggleFavorite, getFavorites };
}
