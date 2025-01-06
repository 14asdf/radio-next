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
import { useStations, isLoading } from '@/contexts/StationsContext';

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
      {/* Hero Section with Background Image */}
      <Box
        position="relative"
        width="100%"
        height={{ base: '80vh', md: '60vh' }}
        minHeight="400px"
        overflow="hidden"
      >
        {/* Blurred Background Image */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          filter="blur(20em)"
          // opacity={0.4}
          style={{
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
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
          {/* Left Side - Image */}
          <Box
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
            <IconButton
              aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
              onClick={() => togglePlay(audioId)}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              boxSize="80px"
              rounded="full"
            >
              {playerState.isPlaying &&
              encodeUrl(playerState.currentStation.streamUrl) === audioId ? (
                <IoPauseOutline size="40px" />
              ) : (
                <IoPlayOutline size="40px" />
              )}
            </IconButton>
          </Box>

          {/* Right Side - Info */}
          <Box
            ml={{ base: 0, md: 8 }}
            color="white"
            textAlign={{ base: 'center', md: 'left' }}
            width={{ base: '100%', md: 'auto' }}
            zIndex={1}
          >
            <Text fontSize={{ base: 'xl', md: '4xl' }} fontWeight="bold" mb={4}>
              {station.title}
            </Text>
            <HStack
              spacing={2}
              wrap="wrap"
              justify={{ base: 'center', md: 'flex-start' }}
              width={{ base: '100%', md: 'auto' }}
              px={{ base: 4, md: 0 }}
              mb={4}
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
          </Box>
        </Box>

        {/* Share Button */}
        <Box position="absolute" right={4} top={4} zIndex={2}>
          <Share />
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(StationInfo);
