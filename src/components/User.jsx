'use client';
import { useEffect, useState, use } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/utils/firebase';
import { Box, VStack, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { useStations } from '@/contexts/StationsContext';
import { decodeUrl, findStation } from '@/utils/stations';
import { Avatar } from '@/components/ui/avatar';
import StationSearchRow from '@/components/StationSearchRow';

export default function User({ id }) {
  const [userData, setUserData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { stations } = useStations();

  useEffect(() => {
    if (!id) return;

    // Fetch user data
    const userRef = ref(db, `users/${id}`);
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData(data);
      }
    });

    // Fetch user's favorites
    const favoritesRef = ref(db, `favorites/${id}`);
    const unsubscribeFavorites = onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();

      // Extract the favorites array from the nested structure
      const favoritesList = data?.favorites || [];

      setFavorites(favoritesList);
    });

    return () => {
      unsubscribeUser();
      unsubscribeFavorites();
    };
  }, [id]);

  if (!userData || !stations || !stations.length) {
    return null;
  }

  // Only render favorites if we have valid stations data
  const validFavorites = favorites.filter((stationId) => {
    try {
      return findStation(stationId, stations) !== undefined;
    } catch (e) {
      return false; // Skip any station IDs that cause decoding errors
    }
  });

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Avatar
          size="2xl"
          name={userData.displayName}
          src={userData.photoURL}
          bg="gray.400"
        />
      </Box>

      <Box>
        <Heading size="2xl" mb={6} mt={6}>
          Favorite stations
        </Heading>
        <SimpleGrid gap={8}>
          {validFavorites.map((stationId) => (
            <StationSearchRow
              key={stationId}
              station={findStation(stationId, stations)}
              searchTerm=""
            />
          ))}
          {validFavorites.length === 0 && (
            <Text color="gray.500">No favorite stations yet</Text>
          )}
        </SimpleGrid>
      </Box>
    </>
  );
}
