'use client';

import { Box, Text, IconButton } from '@chakra-ui/react';
import { BsChevronLeft } from 'react-icons/bs';
import { Toaster } from './components/ui/toaster';
import Player from './components/Player';
import Author from './components/Author';
import StationSelect from './components/StationSelect';
import { ColorModeButton } from './components/ui/color-mode';
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import StationSearch from './components/StationSearch';
import {
  RiHomeLine,
  RiHomeFill,
  RiSearchFill,
  RiSearchLine,
} from 'react-icons/ri';
import Link from 'next/link';
import { useStations } from './contexts/StationsContext';

import { decodeUrl, encodeUrl } from './utils';

import { useAudioPlayer } from './contexts/AudioPlayerContext';
import MiniPlayer from './components/MiniPlayer';

const App = ({ children }) => {
  // Accept children prop
  const { playerState, togglePlay } = useAudioPlayer();
  const { isPlaying, currentStation } = playerState;

  const searchParams = useSearchParams();

  const pathname = usePathname();
  const audioId = searchParams.get('id');

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
            {pathname === '/' && (
              <Box flex="1" display="flex" alignItems="flex-start">
                <svg
                  width="150"
                  height="32"
                  viewBox="0 0 150 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 22C27.3137 22 30 19.3137 30 16C30 12.6863 27.3137 10 24 10C23.3425 10 22.7078 10.1094 22.1159 10.3127C21.0359 7.84819 18.6843 6 16 6C13.3157 6 10.9641 7.84819 9.88406 10.3127C9.29225 10.1094 8.65754 10 8 10C4.68629 10 2 12.6863 2 16C2 19.3137 4.68629 22 8 22H24Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M16 14V18M13 16H19M11 13C11 13 12.5 15 16 15C19.5 15 21 13 21 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x="38"
                    y="20"
                    fill="currentColor"
                    fontFamily="system-ui"
                    fontSize="16"
                    fontWeight="600"
                  >
                    Radio cloud
                  </text>
                </svg>
              </Box>
            )}
            {/* Center Section */}
            <Box flex="1" display="flex" justifyContent="center"></Box>
            {/* Right Section */}
            <Box flex="1" display="flex" justifyContent="center"></Box>
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
