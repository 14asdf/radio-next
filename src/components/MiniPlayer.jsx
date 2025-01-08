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
  IoPlaySkipForwardOutline,
} from 'react-icons/io5';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
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
import { useStations } from '@/contexts/StationsContext';
import { debounce } from 'lodash';

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

  const debouncedSetVolume = React.useCallback(
    debounce((value) => {
      handleVolumeChange(value / 100);
    }, 50),
    []
  );

  const handleNextTrack = () => {
    const currentIndex = stations.findIndex((s) => s.streamUrl === audioSrc);
    const nextIndex =
      currentIndex === stations.length - 1 ? 0 : currentIndex + 1;
    const nextStation = stations[nextIndex];
    togglePlay(encodeUrl(nextStation.streamUrl), true);
  };

  return (
    <Box bg="gray.100" _dark={{ bg: 'gray.700' }} pr="2">
      <Box
        display="grid"
        gridTemplateColumns="60px minmax(0, 1fr) auto"
        alignItems="center"
        gap={3}
      >
        {isLoading ? (
          <Box
            width="60px"
            height="60px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner />
          </Box>
        ) : (
          <Link href={`/?id=${encodeUrl(station.streamUrl)}`}>
            <Image
              src={imgSrc}
              alt={station.title}
              width="60px"
              height="60px"
            />
          </Link>
        )}

        <Box overflow="hidden">
          <Text
            fontSize="sm"
            fontWeight="medium"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            <Link
              href={`/?id=${encodeUrl(station.streamUrl)}`}
              display="inline"
              _hover={{ textDecoration: 'underline' }}
            >
              {station.title}
            </Link>
          </Text>
        </Box>

        <HStack>
          <PopoverRoot
            open={isVolumeOpen}
            onOpenChange={(e) => setIsVolumeOpen(e.open)}
          >
            <PopoverTrigger asChild>
              <IconButton
                variant="subtle"
                borderRadius="full"
                aria-label="Volume"
                size="sm"
                cursor="pointer"
              >
                <VolumeIcon volume={playerState.volume} />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent w="50px" h="175px">
              <PopoverBody p="3">
                <Box w="auto">
                  <Slider
                    w="25px"
                    h="150px"
                    defaultValue={[100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(e) => debouncedSetVolume(e.value)}
                    orientation="vertical"
                  />
                </Box>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>

          <IconButton
            variant="subtle"
            borderRadius="full"
            aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
            onClick={() => togglePlay(audioId)}
            size="sm"
            cursor="pointer"
          >
            {playerState.isLoading ? (
              <Spinner size="sm" />
            ) : playerState.isPlaying ? (
              <IoPauseOutline />
            ) : (
              <IoPlayOutline />
            )}
          </IconButton>

          <IconButton
            variant="subtle"
            borderRadius="full"
            aria-label="Next station"
            onClick={handleNextTrack}
            size="sm"
            cursor="pointer"
          >
            <IoPlaySkipForwardOutline />
          </IconButton>
        </HStack>
      </Box>
    </Box>
  );
};

export default React.memo(MiniPlayer);
