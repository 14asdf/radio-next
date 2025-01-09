import React, { useMemo, useState, useEffect } from 'react';
import { Box, Text, Stack } from '@chakra-ui/react';
import { IoPlayOutline, IoPauseOutline } from 'react-icons/io5';
import Link from 'next/link';
import { createAvatarUrl, encodeUrl } from '../utils/stations';
import _ from 'lodash';
import { AvatarGroup, Avatar } from '../components/ui/avatar';
import { sampleSize } from 'lodash';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useStations } from '../contexts/StationsContext';
import { getGenreColor } from '../utils/colors';
import { useTranslations } from 'next-intl';

// Custom Avatar component with play icon on hover
const StationAvatar = React.memo(({ station }) => {
  const { playerState, togglePlay } = useAudioPlayer();

  const isPlaying = useMemo(() => {
    return (
      playerState.isPlaying &&
      playerState.currentStation?.streamUrl === station.streamUrl
    );
  }, [playerState, station.streamUrl]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const audioId = encodeUrl(station.streamUrl);
    togglePlay(audioId);
  };

  return (
    <Box position="relative" onClick={handleClick}>
      <Avatar
        src={station.img || createAvatarUrl(station.title)}
        name={station.title}
        size="md"
        _hover={{
          transform: 'scale(1.1)',
          transition: 'transform 0.2s',
        }}
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="blackAlpha.600"
        borderRadius="full"
        opacity="0"
        _hover={{ opacity: 1 }}
        transition="opacity 0.2s"
      >
        {isPlaying ? (
          <IoPauseOutline color="white" size="20px" />
        ) : (
          <IoPlayOutline color="white" size="20px" />
        )}
      </Box>
    </Box>
  );
});

// Genre Card component
const GenreCard = React.memo(({ tag, stations }) => {
  const t = useTranslations('genres');

  // Convert tag to translation key format
  const translationKey = tag.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const [maxAvatars, setMaxAvatars] = useState(() => {
    const width = window.innerWidth;
    if (width >= 1536) return 5; // 2xl breakpoint (1536px)
    if (width >= 768) return 4; // md breakpoint (768px)
    return 3; // base
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setMaxAvatars(5);
      else if (width >= 768) setMaxAvatars(4);
      else setMaxAvatars(3);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const randomStations = useMemo(
    () => sampleSize(stations, maxAvatars),
    [stations, maxAvatars]
  );

  const genreColor = useMemo(() => getGenreColor(tag), [tag]);

  const avatarGroup = useMemo(
    () => (
      <AvatarGroup size="md" max={maxAvatars} spacing="-3">
        {randomStations.map((station) => (
          <StationAvatar key={station.streamUrl} station={station} />
        ))}
        {stations.length > maxAvatars && (
          <Avatar fallback={`+${stations.length - maxAvatars}`} />
        )}
      </AvatarGroup>
    ),
    [randomStations, maxAvatars, stations.length]
  );

  return (
    <Box
      as={Link}
      href={`/genre/${encodeURIComponent(tag)}`}
      width="100%"
      position="relative"
      _before={{
        content: '""',
        display: 'block',
        paddingBottom: '100%',
      }}
      _hover={{
        transform: 'translateY(-2px)',
        transition: 'all 0.2s',
      }}
      transition="all 0.2s"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        p={6}
        borderRadius="xl"
        backgroundColor={genreColor}
        opacity={0.9}
        _hover={{
          opacity: 1,
        }}
      >
        <Stack spacing={4} height="100%" justifyContent="space-between">
          <Text
            fontSize={{
              base: 'xl', // 2 columns
              md: 'xl', // 3 columns
              xl: 'xl', // 4 columns
              '2xl': 'xl', // 5 columns
            }}
            fontWeight="bold"
            textTransform="capitalize"
            color="#fff"
            noOfLines={4}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="pre-wrap"
            width="100%"
            wordWrap="normal"
          >
            {t(translationKey)}
          </Text>
          <Box>{avatarGroup}</Box>
        </Stack>
      </Box>
    </Box>
  );
});

const StationSelect = () => {
  const { stations } = useStations();

  // Group stations by tags
  const groupedStations = useMemo(() => {
    const groups = new Map();
    const usedStations = new Set();

    stations.forEach((station) => {
      if (!station.tags) return;

      if (!usedStations.has(station.streamUrl)) {
        const tags = station.tags.split(',').map((tag) => tag.trim());
        if (tags.length > 0) {
          const firstTag = tags[0];
          if (!groups.has(firstTag)) {
            groups.set(firstTag, []);
          }
          groups.get(firstTag).push(station);
          usedStations.add(station.streamUrl);
        }
      }
    });

    return Array.from(groups.entries())
      .map(([tag, stations]) => ({
        tag,
        stations,
      }))
      .filter((group) => group.stations.length >= 5); // Only show genres with at least 5 stations
  }, [stations]);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)',
        '2xl': 'repeat(5, 1fr)',
      }}
      gap={{ base: 4, md: 6 }}
      width="100%"
    >
      {groupedStations.map(({ tag, stations }) => (
        <GenreCard key={tag} tag={tag} stations={stations} />
      ))}
    </Box>
  );
};

export default StationSelect;
