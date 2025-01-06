'use client';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db, auth } from '../../firebase/config';
import { useRouter } from 'next/navigation';
import StationSearchRow from '@/components/StationSearchRow';
import { useStations } from '@/contexts/StationsContext';
import { findStation } from '@/utils';
import { AvatarGroup, Avatar } from '@/components/ui/avatar';
import { useFavorites } from '@/hooks/useFavorites';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { stations } = useStations();
  const router = useRouter();
  const { getFavorites } = useFavorites();
  const [favoritesList, setFavoritesList] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadFavorites = async () => {
      const favorites = (await getFavorites()) || [];
      const favList = Array.isArray(favorites)
        ? favorites
        : Object.keys(favorites);
      setFavoritesList(favList);
    };

    loadFavorites();
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <VStack spacing={8} align="stretch" p={4}>
      <HStack w="full" spacing={4} align="center" justify="space-between">
        <HStack spacing={4} flex={1}>
          <Avatar
            size="2xl"
            name={user?.displayName}
            src={user?.photoURL}
            bg="gray.400"
          />
          {/* <Heading size="lg" flex={1}>
            {user?.displayName}
          </Heading> */}
        </HStack>
        <Button onClick={handleLogout} size="sm" borderRadius="full">
          Log out
        </Button>
      </HStack>

      <Box>
        <Heading size="2xl" mb={4} mt={4}>
          Your favorite stations
        </Heading>
        <SimpleGrid gap={8}>
          {favoritesList.map((stationId) => (
            <StationSearchRow
              key={stationId}
              station={findStation(stationId, stations)}
              searchTerm=""
            />
          ))}
          {favoritesList.length === 0 && (
            <Text color="gray.500">No favorite stations yet</Text>
          )}
        </SimpleGrid>
      </Box>
    </VStack>
  );
};

export default Profile;
