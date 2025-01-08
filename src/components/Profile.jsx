'use client';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db, auth } from '@/utils/firebase';
import { useRouter } from 'next/navigation';
import StationSearchRow from '@/components/StationSearchRow';
import { useStations } from '@/contexts/StationsContext';
import { findStation } from '@/utils/stations';
import { AvatarGroup, Avatar } from '@/components/ui/avatar';
import { useFavorites } from '@/hooks/useFavorites';
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuItemText,
} from '@/components/ui/menu';
import { LuSettings, LuLogOut, LuMenu } from 'react-icons/lu';

export default function Profile() {
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
    <>
      <Box display="flex" justifyContent="center">
        <Box position="relative">
          <Avatar
            size="2xl"
            name={user?.displayName}
            src={user?.photoURL}
            bg="gray.400"
          />
          <MenuRoot>
            <MenuTrigger asChild>
              <IconButton
                size="xsm"
                rounded="full"
                aria-label="Profile menu"
                position="absolute"
                bottom={-1}
                right={-1}
                shadow="md"
              >
                <LuMenu />
              </IconButton>
            </MenuTrigger>
            <MenuContent
              rounded="full"
              style={{ width: 'fit-content', minWidth: 'auto' }}
            >
              <MenuItem onClick={handleLogout} rounded="full" cursor="pointer">
                <HStack spacing={2}>
                  <LuLogOut />
                  <Text>Log out</Text>
                </HStack>
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Box>
      </Box>

      <Box>
        <Heading size="2xl" mb={6} mt={6}>
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
    </>
  );
}
