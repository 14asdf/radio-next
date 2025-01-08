'use client';
import { useEffect, useState, use } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/utils/firebase';
import { Box, VStack, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { useStations } from '@/contexts/StationsContext';
import { decodeUrl, findStation } from '@/utils/stations';
import { Avatar } from '@/components/ui/avatar';
import StationSearchRow from '@/components/StationSearchRow';
import { useTranslations } from 'next-intl';

export default function User({ id }) {
  const [userData, setUserData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { stations } = useStations();
  const t = useTranslations('profile');

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
    <Box
      w="100%"
      minH="100vh"
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
      borderBottomRadius={16}
      borderTopRadius={16}
    >
      <Box
        position="relative"
        h="300px"
        w="100%"
        borderTopRadius={16}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {/* Add SVG filter definition */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter
              id="blur-filter"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="300" edgeMode="none" />
              <fePadding left="50%" right="50%" top="50%" bottom="50%" />
            </filter>
          </defs>
        </svg>

        {/* Replace gradient overlay with blurred background */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{ filter: 'url(#blur-filter)' }}
          backgroundImage={`url(${userData?.photoURL})`}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          backgroundColor="gray.900"
        />

        {/* Avatar (updated to match Profile styling) */}
        <Box position="relative" zIndex={1}>
          <Avatar
            size="2xl"
            name={userData.displayName}
            src={userData.photoURL}
            bg="gray.400"
          />
        </Box>

        {/* Heading (updated with white text) */}
        <Heading
          position="absolute"
          bottom="40px"
          left="24px"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          zIndex={1}
          color="white"
        >
          {t('favoriteStations')}
        </Heading>
      </Box>

      <Box p={6}>
        <SimpleGrid gap={8}>
          {validFavorites.map((stationId) => (
            <StationSearchRow
              key={stationId}
              station={findStation(stationId, stations)}
              searchTerm=""
            />
          ))}
          {validFavorites.length === 0 && (
            <Text color="gray.500">{t('noFavorites')}</Text>
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
