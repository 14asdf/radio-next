'use client';

import { Box, Text, IconButton } from '@chakra-ui/react';
import { BsChevronLeft } from 'react-icons/bs';
import { Toaster } from './ui/toaster';
import Player from './Player';
import Author from './Author';
import StationSelect from './StationSelect';
import { ColorModeButton } from './ui/color-mode';
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import StationSearch from './StationSearch';
import {
  RiHomeLine,
  RiHomeFill,
  RiSearchFill,
  RiSearchLine,
} from 'react-icons/ri';
import Link from 'next/link';
import s from '../stations.json';
import _ from 'lodash';
const stations = _.uniqBy(s, 'title');

import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import MiniPlayer from './MiniPlayer';

const App = ({ initialId }) => {
  const { playerState, togglePlay } = useAudioPlayer();
  const { isPlaying, currentStation, stationInMiniPlayer } = playerState;

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
        <Box as="header" p={2} borderBottomWidth="0">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Left Section */}
            <Box flex="1" display="flex" justifyContent="center"></Box>
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
          {pathname === '/' &&
            (audioId ? <Player audioId={audioId} /> : <StationSelect />)}
          {pathname === '/search' && <StationSearch stations={stations} />}
        </Box>

        {/* Footer */}
        <Box
          as="footer"
          pb="1"
          // pl={{ base: '4', md: '14' }}
          // pr={{ base: '4', md: '14' }}
        >
          {stationInMiniPlayer && <MiniPlayer audioId={stationInMiniPlayer} />}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Left Section */}
            <Box flex="1" display="flex" justifyContent="center">
              <Box
                as={Link}
                href="/"
                style={{ textDecoration: 'none' }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                {pathname === '/' && !searchParams.get('id') ? (
                  <RiHomeFill size={24} />
                ) : (
                  <RiHomeLine size={24} />
                )}
                <Text fontSize="xs" mt={1}>
                  Home
                </Text>
              </Box>
            </Box>

            {/* Center Section */}
            <Box flex="1" display="flex" justifyContent="center">
              <Box
                as={Link}
                href="/search"
                style={{ textDecoration: 'none' }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                {pathname === '/search' ? (
                  <RiSearchFill size={24} />
                ) : (
                  <RiSearchLine size={24} />
                )}
                <Text fontSize="xs" mt={1}>
                  Search
                </Text>
              </Box>
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
