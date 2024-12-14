'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Text,
  IconButton,
  HStack,
  Spinner,
  Separator,
} from '@chakra-ui/react';
import {
  IoPlayOutline,
  IoPauseOutline,
  IoVolumeHighOutline,
  IoVolumeLowOutline,
  IoVolumeMediumOutline,
  IoVolumeMuteOutline,
} from 'react-icons/io5';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import s from '../stations.json';
import _ from 'lodash';
import { createAvatarUrl, decodeUrl, findStation, encodeUrl } from '@/utils';
import Link from 'next/link';
// import { Link } from 'react-router-dom';

import { Slider } from '@/components/ui/slider';
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';

const stations = _.uniqBy(s, 'title');

const VolumeIcon = ({ volume }) => {
  if (volume === 0) return <IoVolumeMuteOutline />;
  if (volume < 0.33) return <IoVolumeLowOutline />;
  if (volume < 0.66) return <IoVolumeMediumOutline />;
  return <IoVolumeHighOutline />;
};

const MiniPlayer = ({ audioId }) => {
  const { playerState, togglePlay, handleVolumeChange } = useAudioPlayer();
  const [imgSrc, setImgSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

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

  const setVolume = (value) => {
    handleVolumeChange(value / 100);
  };

  return (
    <Box bg="gray.100" _dark={{ bg: 'gray.700' }} pr="2">
      <HStack justify="space-between" align="center" mb="2">
        <HStack as={Link} href={`/?id=${encodeUrl(station.streamUrl)}`}>
          {/* <HStack as={Link} to={`/?id=${encodeUrl(station.streamUrl)}`}> */}
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="60px"
              height="60px"
            >
              <Spinner size="md" color="gray.500" />
            </Box>
          ) : (
            <Image
              src={imgSrc}
              alt={station.title}
              width="60px"
              height="60px"
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

        <HStack>
          <PopoverRoot
            open={isVolumeOpen}
            onOpenChange={(e) => setIsVolumeOpen(e.open)}
          >
            <PopoverTrigger asChild>
              <IconButton
                variant="subtle"
                colorPalette="yellow"
                borderRadius="full"
                aria-label="Volume"
                size="sm"
                cursor="pointer"
              >
                <VolumeIcon volume={playerState.volume} />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent w="50px" h="170px">
              <PopoverBody p="3">
                <Box w="150px">
                  <Slider
                    width="25px"
                    height="150px"
                    defaultValue={[100]}
                    min={0}
                    max={100}
                    step={1}
                    colorPalette="yellow"
                    onValueChange={(e) => setVolume(e.value)}
                    orientation="vertical"
                  />
                </Box>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>

          <IconButton
            variant="subtle"
            colorPalette="yellow"
            borderRadius="full"
            aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
            onClick={() => togglePlay(audioId)}
            size="sm"
            cursor="pointer"
          >
            {playerState.isPlaying ? <IoPauseOutline /> : <IoPlayOutline />}
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
};

export default React.memo(MiniPlayer);
