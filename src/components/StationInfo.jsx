'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Text,
  IconButton,
  Separator,
  Badge,
  Stack,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import { IoPlayOutline } from 'react-icons/io5';
import { IoPauseOutline } from 'react-icons/io5';
import { useStations } from '@/contexts/StationsContext';

import {
  encodeUrl,
  decodeUrl,
  findStation,
  generateUUID,
  createAvatarUrl,
} from '../utils'; // Assuming utility functions are in utils.js
import Share from './Share';
import _ from 'lodash';

import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const StationInfo = ({ audioId }) => {
  const { playerState, togglePlay, currentStation } = useAudioPlayer();
  const [imgSrc, setImgSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { stations } = useStations();
  const audioSrc = React.useMemo(() => decodeUrl(audioId), [audioId]);
  const station = React.useMemo(
    () => (audioSrc ? findStation(audioId, stations) : null),
    [audioId, audioSrc]
  );

  useEffect(() => {
    setIsLoading(true);
    if (station?.img) {
      const img = new window.Image();
      img.src = station.img;
      img.onerror = () => {
        setImgSrc(createAvatarUrl(station.title));
        setIsLoading(false);
      };
      img.onload = () => {
        setImgSrc(station.img);
        setIsLoading(false);
      };
    } else {
      setImgSrc(createAvatarUrl(station.title));
      setIsLoading(false);
    }
  }, [station]);

  return (
    <Box width="100%">
      <Box
        position="relative"
        width="100%"
        height={{ base: '80vh', md: '60vh' }}
        minHeight="400px"
        overflow="hidden"
        borderRadius="2em"
      >
        {/* SVG Filter Definition */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter
              id="blur-filter"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="300" edgeMode="duplicate" />
            </filter>
          </defs>
        </svg>

        {/* Background Image */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{ filter: 'url(#blur-filter)' }}
          backgroundImage={`url(${imgSrc})`}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          backgroundColor="gray.900"
        />

        {/* Main Content Container */}
        <Box
          position="relative"
          maxWidth="1200px"
          margin="0 auto"
          height="100%"
          px={4}
          py={8}
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'center', md: 'center' }}
          justifyContent={{ base: 'center', md: 'flex-start' }}
          gap={{ base: 6, md: 8 }}
        >
          {/* Info Section with Play Button */}
          <Box order={{ base: 2, md: 1 }} width="100%" zIndex={1}>
            <HStack
              spacing={{ base: 2, md: 6 }}
              mb={4}
              justify={{ base: 'space-between', md: 'flex-start' }}
              width="100%"
              alignItems="flex-start"
            >
              {/* Play Button - Desktop Only */}
              <IconButton
                aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
                onClick={() => togglePlay(audioId)}
                boxSize={{ base: '56px', md: '70px' }}
                rounded="full"
                colorScheme="brand"
                display={{ base: 'none', md: 'flex' }}
                m={4}
              >
                {playerState.isPlaying &&
                encodeUrl(playerState.currentStation.streamUrl) === audioId ? (
                  <IoPauseOutline size={{ base: '24px', md: '32px' }} />
                ) : (
                  <IoPlayOutline size={{ base: '24px', md: '32px' }} />
                )}
              </IconButton>

              {/* Title, Tags, and Share Stack */}
              <Stack spacing={2} flex={1}>
                <HStack
                  justify={{ base: 'space-between', md: 'flex-start' }}
                  width="100%"
                >
                  <Text fontSize={{ base: 'xl', md: '4xl' }} fontWeight="bold">
                    {station.title}
                  </Text>

                  {/* Play Button - Mobile Only */}
                  <IconButton
                    aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
                    onClick={() => togglePlay(audioId)}
                    boxSize="56px"
                    rounded="full"
                    colorScheme="brand"
                    display={{ base: 'flex', md: 'none' }}
                    p={4}
                  >
                    {playerState.isPlaying &&
                    encodeUrl(playerState.currentStation.streamUrl) ===
                      audioId ? (
                      <IoPauseOutline size="24px" />
                    ) : (
                      <IoPlayOutline size="24px" />
                    )}
                  </IconButton>
                </HStack>

                <HStack
                  spacing={2}
                  wrap="wrap"
                  justify={{ base: 'flex-start', md: 'flex-start' }}
                  width="100%"
                >
                  {station.tags
                    ?.split(',')
                    .filter(Boolean)
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length >= 3 && tag.length <= 10)
                    .slice(0, 3)
                    .map((tag) => (
                      <Badge
                        key={generateUUID()}
                        colorScheme="whiteAlpha"
                        variant="solid"
                        fontSize="sm"
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {tag}
                      </Badge>
                    ))}
                </HStack>

                {/* Share Button */}
                <Box pt={2}>
                  <Share />
                </Box>
              </Stack>
            </HStack>
          </Box>

          {/* Image Section */}
          <Box
            order={{ base: 1, md: 2 }}
            width={{ base: '240px', md: '320px' }}
            height={{ base: '240px', md: '320px' }}
            position="relative"
            flexShrink={0}
          >
            {isLoading ? (
              <Box
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner size="xl" color="white" />
              </Box>
            ) : (
              <Image
                src={imgSrc}
                alt={station.title}
                width="100%"
                height="100%"
                objectFit="cover"
                borderRadius="lg"
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(StationInfo);
