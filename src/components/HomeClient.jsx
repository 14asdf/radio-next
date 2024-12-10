'use client';

import { Box, Text, IconButton } from '@chakra-ui/react';
import { BsChevronLeft } from 'react-icons/bs';
import { Toaster } from './ui/toaster';
import Player from './Player';
import Author from './Author';
import StationSelect from './StationSelect';
import { ColorModeButton } from './ui/color-mode';
import { useSearchParams } from 'next/navigation';

const HomeClient = ({ initialId }) => {
  const searchParams = useSearchParams();
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
        <Box as="header" p={4} borderBottomWidth="0">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Left Section */}
            <Box flex="1" display="flex" justifyContent="center">
              {audioId && (
                <IconButton
                  as="a"
                  href="/"
                  variant="subtle"
                  colorPalette="yellow"
                  size="xl"
                  rounded={'full'}
                >
                  <BsChevronLeft />
                </IconButton>
              )}
            </Box>
            {/* Center Section */}
            <Box flex="1" display="flex" justifyContent="center"></Box>

            {/* Right Section */}
            <Box flex="1" display="flex" justifyContent="center"></Box>
          </Box>
        </Box>

        {/* Main Content - Scrollable */}
        <Box flex="1" overflow="auto" p={4} justifyContent="center">
          {audioId ? <Player audioId={audioId} /> : <StationSelect />}
        </Box>

        {/* Footer */}
        <Box as="footer" p={4} borderTopWidth="0">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Left Section */}
            <Box flex="1" display="flex" justifyContent="center"></Box>

            {/* Center Section */}
            <Box flex="1" display="flex" justifyContent="center">
              <ColorModeButton />
            </Box>

            {/* Right Section */}
            <Box flex="1" display="flex" justifyContent="center">
              <Author />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HomeClient;
