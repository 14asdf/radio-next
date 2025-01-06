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

import PlayerDialog from './PlayerDialog';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const Player = ({ audioId }) => {
  const { playerState, togglePlay, currentStation } = useAudioPlayer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    <Box
      justifyContent="center"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <PlayerDialog
        isOpen={isDialogOpen}
        onOpenChange={(e) => setIsDialogOpen(e.open)}
        station={station}
        isLoading={isLoading}
        imgSrc={imgSrc}
      />

      <Box
        display="flex"
        justifyContent="center"
        position="relative"
        width="250px"
        margin="0 auto"
        mb="1em"
      >
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="250px"
            height="250px"
          >
            <Spinner size="md" color="gray.500" />
          </Box>
        ) : (
          <Image
            src={imgSrc}
            alt={station.title}
            width="250px"
            height="250px"
            borderRadius="lg"
            cursor="pointer"
            onClick={() => setIsDialogOpen(true)}
          />
        )}
        <Box position="absolute" right="-1em" bottom="-1em">
          <Share />
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom="1em"
      >
        <Box display="inline-flex" alignItems="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            overflow="hidden"
            textOverflow="ellipsis"
            textWrap="nowrap"
            maxW={{ base: '250px', md: '400px' }}
          >
            {station.title}
          </Text>
        </Box>
      </Box>
      <Box position="relative">
        <Box display="flex" gap="2" justifyContent="center">
          {station.tags
            .split(',')
            .filter((tag) => tag.trim().length <= 10 && tag.length > 3)
            .slice(0, 3)
            .map((tag) => (
              <Badge
                key={tag}
                colorScheme="gray"
                variant="subtle"
                fontSize="xs"
                borderRadius="full"
                p={2}
                fontWeight="bold"
              >
                {tag.trim()}
              </Badge>
            ))}
        </Box>

        <Box display="flex" justifyContent="center" marginTop="1em">
          <IconButton
            aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
            onClick={() => {
              togglePlay(audioId);
            }}
            boxSize={{ base: '60px', md: '80px' }}
            rounded={'full'}
          >
            {playerState.isPlaying &&
            encodeUrl(playerState.currentStation.streamUrl) === audioId ? (
              <IoPauseOutline />
            ) : (
              <IoPlayOutline />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Player);
