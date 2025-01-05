import React, { useMemo } from 'react';
import { Box, Text, Stack, Icon, useBreakpointValue } from '@chakra-ui/react';
import { RiPlayFill } from 'react-icons/ri';
import Link from 'next/link';
import { createAvatarUrl, encodeUrl } from '../utils';
import s from '../stations.json';
import _ from 'lodash';
import { AvatarGroup, Avatar } from '../components/ui/avatar';
import { sampleSize } from 'lodash';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

const COLORS = [
  'red.500',
  'red.600',
  'orange.500',
  'orange.600',
  'yellow.500',
  'yellow.600',
  'green.500',
  'green.600',
  'teal.500',
  'teal.600',
  'blue.500',
  'blue.600',
  'cyan.500',
  'cyan.600',
  'purple.500',
  'purple.600',
  'pink.500',
  'pink.600',
];

const GENRE_COLORS = {
  rock: 'red.500',
  jazz: 'purple.500',
  classical: 'blue.500',
  electronic: 'green.500',
  pop: 'pink.500',
  default: () => COLORS[Math.floor(Math.random() * COLORS.length)],
};

const stations = _.uniqBy(s, 'title');

// Custom Avatar component with play icon on hover
const StationAvatar = React.memo(({ station }) => {
  const { playerState, togglePlay, stationInMiniPlayer } = useAudioPlayer();

  const handleClick = (e) => {
    e.stopPropagation(); // Stop event bubbling
    e.preventDefault(); // Prevent link navigation
    stationInMiniPlayer(encodeUrl(station.streamUrl)); // Using station.streamUrl instead of undefined audioId
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
        <RiPlayFill color="white" size="20px" />
      </Box>
    </Box>
  );
});

// Genre Card component
const GenreCard = React.memo(({ tag, stations }) => {
  const randomStations = useMemo(() => sampleSize(stations, 5), [stations]);
  const maxAvatars = useBreakpointValue({ base: 3, md: 5 });
  const genreColor = useMemo(
    () =>
      GENRE_COLORS[tag.toLowerCase()] ||
      COLORS[Math.floor(Math.random() * COLORS.length)],
    [tag]
  );

  return (
    <Box
      as={Link}
      href={`/search?type=genre&q=${encodeURIComponent(tag)}`}
      width={{ base: 'calc(50% - 0.5rem)', md: 'calc(33.333% - 0.75rem)' }}
      p={6}
      borderRadius="xl"
      backgroundColor={genreColor}
      opacity={0.9}
      _hover={{
        opacity: 1,
        transform: 'translateY(-2px)',
        transition: 'all 0.2s',
      }}
      transition="all 0.2s"
    >
      <Stack spacing={4}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          textTransform="capitalize"
          color="#fff"
        >
          {tag}
        </Text>
        <AvatarGroup size="md" max={{ base: 3, md: 5 }} spacing="-3">
          {randomStations.slice(0, maxAvatars).map((station) => (
            <StationAvatar key={station.streamUrl} station={station} />
          ))}
          {stations.length > maxAvatars && (
            <Avatar fallback={`+${stations.length - maxAvatars}`} />
          )}
        </AvatarGroup>
      </Stack>
    </Box>
  );
});

const StationSelect = () => {
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
  }, []);

  return (
    <Box display="flex" flexWrap="wrap" gap={4} width="100%">
      {groupedStations.map(({ tag, stations }) => (
        <GenreCard key={tag} tag={tag} stations={stations} />
      ))}
    </Box>
  );
};

export default StationSelect;
