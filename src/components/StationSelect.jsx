import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Image,
  Text,
  Input,
  Badge,
  IconButton,
  Separator,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { InputGroup, InputRightElement } from '@chakra-ui/input';
import { generateUUID, encodeUrl, decodeUrl } from '../utils'; // Import necessary utilities
import s from '../stations.json';
import _ from 'lodash';
import { IoCloseOutline } from 'react-icons/io5';
import { Avatar, AvatarGroup } from './ui/avatar';

const stations = _.uniqBy(s, 'title');

// Move StationRow outside and memoize it
const StationRow = React.memo(({ station }) => {
  const colorPalette = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const pickPalette = (name) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  return (
    <Box
      as="a"
      href={`/?id=${encodeUrl(station.streamUrl)}`}
      display="flex"
      flexDirection="column"
      gap="2"
      p="2"
      pl="0"
      mr="8"
      minW="150px"
      maxW="150px"
      _hover={{
        cursor: 'pointer',
      }}
    >
      <Avatar
        colorPalette={pickPalette(station.title)}
        src={station.img}
        name={station.title}
        shape="rounded"
        boxSize="150px"
        alt={station.title}
      />
      <Text
        overflow="hidden"
        textOverflow="ellipsis"
        textWrap="nowrap"
        maxW="100%"
      >
        {station.title}
      </Text>
    </Box>
  );
});

// Create a separate row component
const StationGroupRow = React.memo(
  ({ tag, stations, visibleItems, isLoading, onScroll, onLoadMore }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
      const container = scrollRef.current;
      if (container) {
        const handleScrollEvent = (e) => onScroll(e, tag, stations);
        container.addEventListener('scroll', handleScrollEvent);
        return () => container.removeEventListener('scroll', handleScrollEvent);
      }
    }, [tag, stations, onScroll]);

    return (
      <Box
        ref={scrollRef}
        position="relative"
        display="flex"
        overflowX="auto"
        gap={4}
        // css={{
        //   '&::-webkit-scrollbar': { height: '8px' },
        //   '&::-webkit-scrollbar-track': { background: 'rgba(0, 0, 0, 0.1)' },
        //   '&::-webkit-scrollbar-thumb': {
        //     background: 'rgba(0, 0, 0, 0.2)',
        //     borderRadius: '4px',
        //   },
        // }}
      >
        {stations.slice(0, visibleItems).map((station) => (
          <StationRow key={station.streamUrl} station={station} />
        ))}
        {stations.length > visibleItems && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW="200px"
            h="200px"
            flexDirection="column"
            gap={4}
          >
            {isLoading ? (
              <Spinner size="md" color="gray.500" />
            ) : (
              <>
                <Button
                  size="sm"
                  colorScheme="black"
                  borderRadius="full"
                  onClick={() => onLoadMore(tag)}
                >
                  Load More
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>
    );
  }
);

const StationSelect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleItemsMap, setVisibleItemsMap] = useState(new Map());
  const containerRef = useRef(null);

  // Group stations by tags first
  const groupedStations = React.useMemo(() => {
    const groups = new Map();
    const usedStations = new Set(); // Track which stations have been assigned

    stations.forEach((station) => {
      if (!station.tags) return;

      // Only process station if it hasn't been used yet
      if (!usedStations.has(station.streamUrl)) {
        const tags = station.tags.split(',').map((tag) => tag.trim());

        // Add station to its first matching tag group
        if (tags.length > 0) {
          const firstTag = tags[0];
          if (!groups.has(firstTag)) {
            groups.set(firstTag, []);
          }
          groups.get(firstTag).push(station);
          usedStations.add(station.streamUrl); // Mark station as used
        }
      }
    });

    return Array.from(groups.entries())
      .map(([tag, stations]) => ({ tag, stations }))
      .filter(
        (group) =>
          searchTerm === '' ||
          group.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.stations.some((s) =>
            s.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
  }, [searchTerm]);

  // Initialize visibleItemsMap for new tags
  useEffect(() => {
    groupedStations.forEach(({ tag }) => {
      if (!visibleItemsMap.has(tag)) {
        setVisibleItemsMap((prev) => new Map(prev).set(tag, 10));
      }
    });
  }, [groupedStations]);

  const handleScroll = useCallback(
    (event, tag, stations) => {
      const container = event.target;
      const isNearEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 50;

      if (
        isNearEnd &&
        !isLoading &&
        stations.length > visibleItemsMap.get(tag)
      ) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleItemsMap((prev) =>
            new Map(prev).set(tag, prev.get(tag) + 10)
          );
          setIsLoading(false);
        }, 500);
      }
    },
    [isLoading, visibleItemsMap]
  );

  const handleLoadMore = useCallback(
    (tag) => {
      if (!isLoading && stations.length > visibleItemsMap.get(tag)) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleItemsMap((prev) =>
            new Map(prev).set(tag, prev.get(tag) + 10)
          );
          setIsLoading(false);
        }, 500);
      }
    },
    [isLoading, visibleItemsMap]
  );

  return (
    <Box mx="auto" ref={containerRef}>
      <Box
        position="sticky"
        top={0}
        bg="inherit"
        zIndex={1}
        pb={5}
        pt={5}
        background={{
          base: 'var(--chakra-colors-white)',
          _dark: { base: 'var(--chakra-colors-black)' },
        }}
      >
        <InputGroup>
          <Input
            variant="subtle"
            fontSize="xl"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            colorPalette="yellow"
          />
          {searchTerm && (
            <InputRightElement>
              <IconButton
                variant="ghost"
                colorPalette="yellow"
                rounded={'full'}
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <IoCloseOutline />
              </IconButton>
            </InputRightElement>
          )}
        </InputGroup>
      </Box>

      <Box overflow="auto">
        {groupedStations.length === 0 ? (
          <Text fontSize={25} textAlign="center" mt={4}>
            No stations found for "{searchTerm}"
          </Text>
        ) : (
          groupedStations.map(({ tag, stations }, index) => (
            <Box key={tag} mb={6}>
              <Text fontSize="2xl" mb={2} fontWeight="bold">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Text>
              <StationGroupRow
                tag={tag}
                stations={stations}
                visibleItems={visibleItemsMap.get(tag)}
                isLoading={isLoading}
                onScroll={handleScroll}
                onLoadMore={handleLoadMore}
              />
              {index < groupedStations.length - 1 && <Separator my={4} />}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default StationSelect;
