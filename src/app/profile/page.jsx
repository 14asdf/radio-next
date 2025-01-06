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

const Profile = () => {
  const { user, setUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
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
        <Heading size="lg">{user?.displayName}</Heading>
        <Text>{user?.email}</Text>
        <Button onClick={handleLogout} colorScheme="red" size="sm">
          Log out
        </Button>
      </VStack>

      <Box>
        <Heading size="md" mb={4}>
          Favorite Stations
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {favorites.map((stationId) => (
            <Text key={stationId}>{stationId}</Text>
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
