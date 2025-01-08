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
import { useTranslations } from 'next-intl';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { stations } = useStations();
  const router = useRouter();
  const { getFavorites } = useFavorites();
  const [favoritesList, setFavoritesList] = useState([]);
  const t = useTranslations('profile');

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
        bg="purple.500"
        _dark={{ bg: 'purple.800' }}
        borderTopRadius={16}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 100%)"
          _dark={{
            bg: 'linear-gradient(180deg, rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.95) 100%)',
          }}
          pointerEvents="none"
        />

        <Box position="relative" zIndex={1}>
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
                  <Text>{t('logout')}</Text>
                </HStack>
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Box>

        <Heading
          position="absolute"
          bottom="40px"
          left="24px"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          zIndex={1}
        >
          {t('favoriteStations')}
        </Heading>
      </Box>

      <Box p={6}>
        <SimpleGrid gap={8}>
          {favoritesList.map((stationId) => (
            <StationSearchRow
              key={stationId}
              station={findStation(stationId, stations)}
              searchTerm=""
            />
          ))}
          {favoritesList.length === 0 && (
            <Text color="gray.500">{t('noFavorites')}</Text>
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
