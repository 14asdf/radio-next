'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Text,
  IconButton,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import { IoPlayOutline, IoPauseOutline } from 'react-icons/io5';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import s from '../stations.json';
import _ from 'lodash';
import { createAvatarUrl, decodeUrl, findStation, encodeUrl } from '@/utils';
import Link from 'next/link';

const stations = _.uniqBy(s, 'title');

const MiniPlayer = ({ audioId }) => {
  const { playerState, togglePlay } = useAudioPlayer();
  const [imgSrc, setImgSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    <Box borderTop="1px solid" borderColor="gray.200" p={2}>
      <HStack spacing={4} justify="space-between" align="center" px={4}>
        <HStack
          spacing={3}
          as={Link}
          href={`/?id=${encodeUrl(station.streamUrl)}`}
        >
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="40px"
              height="40px"
            >
              <Spinner size="md" color="gray.500" />
            </Box>
          ) : (
            <Image
              src={imgSrc}
              alt={station.title}
              width="40px"
              height="40px"
              borderRadius="md"
            />
          )}

          <Text
            fontSize="sm"
            fontWeight="medium"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            maxW="200px"
          >
            {station.title}
          </Text>
        </HStack>

        <Box
          aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
          onClick={() => togglePlay(audioId)}
          size="sm"
          cursor="pointer"
        >
          {playerState.isPlaying ? <IoPauseOutline /> : <IoPlayOutline />}
        </Box>
      </HStack>
    </Box>
  );
};

export default React.memo(MiniPlayer);
