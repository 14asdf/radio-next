'use client';
import {
  Box,
  VStack,
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

const Profile = () => {
  const { user, setUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const { stations } = useStations();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const favoritesRef = ref(db, `users/${user.uid}/favorites`);
    const unsubscribe = onValue(favoritesRef, (snapshot) => {
      const favoritesData = snapshot.val() || [];
      setFavorites(favoritesData);
    });

    return () => unsubscribe();
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
      <VStack align="center" spacing={4}>
        <Avatar
          size="2xl"
          name={user?.displayName}
          src={user?.photoURL}
          bg="gray.400"
        />
        <Heading size="lg">{user?.displayName}</Heading>
        <Button onClick={handleLogout} size="sm" borderRadius="full">
          Log out
        </Button>
      </VStack>

      <Box>
        <Heading size="2xl" mb={4}>
          Your favorite stations
        </Heading>
        <SimpleGrid gap={8}>
          {favorites.map((stationId) => (
            <StationSearchRow
              key={stationId}
              station={findStation(stationId, stations)}
              searchTerm="" // You can pass an empty string or omit if not needed
            />
          ))}
          {favorites.length === 0 && (
            <Text color="gray.500">No favorite stations yet</Text>
          )}
        </SimpleGrid>
      </Box>
    </VStack>
  );
};

export default Profile;
