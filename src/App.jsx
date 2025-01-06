'use client';

import { Box, Text, IconButton } from '@chakra-ui/react';
import { Toaster } from './components/ui/toaster';

import { ColorModeButton } from './components/ui/color-mode';
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  RiHomeLine,
  RiHomeFill,
  RiSearchFill,
  RiSearchLine,
} from 'react-icons/ri';
import Link from 'next/link';
import { AvatarGroup, Avatar } from '@/components/ui/avatar';

import { decodeUrl, encodeUrl } from './utils';

import { useAudioPlayer } from './contexts/AudioPlayerContext';
import MiniPlayer from './components/MiniPlayer';
import Logo from './components/shared/Logo';
import { useAuth } from './contexts/AuthContext';

const App = ({ children }) => {
  // Accept children prop
  const { playerState, togglePlay } = useAudioPlayer();
  const { isPlaying, currentStation } = playerState;

  const searchParams = useSearchParams();

  const pathname = usePathname();
  const audioId = searchParams.get('id');

  const { user } = useAuth();

  return (
    <>
      <Toaster />
      <Box
        height={{ base: '100dvh', md: '100vh' }}
        display="flex"
        flexDirection="column"
        _dark={{ color: '#ffffff' }}
      >
        {/* Header */}
        <Box
          as="header"
          p={2}
          borderBottomWidth="0"
          pl={{ base: '4', md: '20' }}
          pr={{ base: '4', md: '20' }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Left Section */}
            {pathname === '/' && <Logo />}

            {/* Right Section */}
            <Box flex="1" display="flex" justifyContent="flex-end" gap={4}>
              {user ? (
                <Avatar
                  as={Link}
                  href="/profile"
                  size="sm"
                  src={user.photoURL}
                  name={user.displayName}
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                />
              ) : (
                <Text
                  as={Link}
                  href="/login"
                  fontSize="sm"
                  fontWeight="bold"
                  bg="black"
                  color="white"
                  _dark={{ bg: 'white', color: 'black' }}
                  px={4}
                  py={2}
                  borderRadius="full"
                  _hover={{ opacity: 0.8 }}
                >
                  Log in
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        {/* Main Content - Scrollable */}
        <Box
          flex="1"
          overflow="auto"
          pb="4"
          pl={{ base: '4', md: '20' }}
          pr={{ base: '4', md: '20' }}
          pt={audioId ? 4 : 0}
          justifyContent="center"
          as="main"
        >
          {children}
        </Box>

        {/* Footer */}
        <Box as="footer">
          {currentStation && (
            <MiniPlayer audioId={encodeUrl(currentStation.streamUrl)} />
          )}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pb="1.5"
            pt="1.5"
          >
            {/* Left Section */}
            <Box flex="1" display="flex" justifyContent="center">
              <IconButton
                as={Link}
                href="/"
                variant="ghost"
                borderRadius="full"
              >
                {pathname === '/' && !searchParams.get('id') ? (
                  <RiHomeFill size={24} />
                ) : (
                  <RiHomeLine size={24} />
                )}
              </IconButton>
            </Box>

            {/* Center Section */}
            <Box flex="1" display="flex" justifyContent="center">
              <IconButton
                as={Link}
                href="/search"
                variant="ghost"
                borderRadius="full"
              >
                {pathname === '/search' ? (
                  <RiSearchFill size={24} />
                ) : (
                  <RiSearchLine size={24} />
                )}
              </IconButton>
            </Box>

            {/* Right Section */}
            <Box
              flex="1"
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <ColorModeButton />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default App;
