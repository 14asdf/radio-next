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
import { generateUUID, encodeUrl, decodeUrl, createAvatarUrl } from '../utils'; // Update imports
import s from '../stations.json';
import _ from 'lodash';
import { IoCloseOutline } from 'react-icons/io5';
import Link from 'next/link';

const stations = _.uniqBy(s, 'title');

// Move StationRow outside and memoize it
const StationRow = React.memo(({ station }) => {
  const [imgSrc, setImgSrc] = useState(createAvatarUrl(station.title));
  const [isLoading, setIsLoading] = useState(true);

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
      as={Link}
      href={`/?id=${encodeUrl(station.streamUrl)}`}
      display="flex"
      flexDirection="column"
      gap="2"
      p="2"
      pl="0"
      mr="1"
      minW="160px"
      maxW="160px"
      _hover={{
        cursor: 'pointer',
      }}
    >
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="160px"
          height="160px"
        >
          <Spinner size="md" color="gray.500" />
        </Box>
      ) : (
        <Image
          src={imgSrc}
          borderRadius="md"
          boxSize="160px"
          alt={station.title}
          objectFit="cover"
        />
      )}
      <Text
        overflow="hidden"
        textOverflow="ellipsis"
        textWrap="nowrap"
        maxW="100%"
        fontSize="sm"
        fontWeight="bold"
      >
        {station.title}
      </Text>
      {station.tags && (
        <Box display="flex" gap="2">
          {station.tags
            .split(',')
            .filter((tag) => tag.trim().length <= 10)
            .slice(0, 2)
            .map((tag) => (
              <Badge
                key={tag}
                colorScheme="gray"
                variant="subtle"
                fontSize="xs"
                borderRadius="full"
              >
                {tag.trim()}
              </Badge>
            ))}
        </Box>
      )}
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
  const [isLoading, setIsLoading] = useState(false);
  const [visibleItemsMap, setVisibleItemsMap] = useState(new Map());
  const containerRef = useRef(null);
  const [visibleGroups, setVisibleGroups] = useState(3);
  const [isVerticalLoading, setIsVerticalLoading] = useState(false);

  // Group stations by tags (without filtering)
  const groupedStations = React.useMemo(() => {
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

    return Array.from(groups.entries()).map(([tag, stations]) => ({
      tag,
      stations,
    }));
  }, []);

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

  // Modify loadMoreGroups to add more categories at once
  const loadMoreGroups = useCallback(() => {
    setIsVerticalLoading(true);
    setTimeout(() => {
      setVisibleGroups((prev) => prev + 10);
      setIsVerticalLoading(false);
    }, 500);
  }, []);

  // Update scroll handler with IntersectionObserver
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const lastEntry = entries[0];
      if (
        lastEntry.isIntersecting &&
        !isVerticalLoading &&
        visibleGroups < groupedStations.length
      ) {
        loadMoreGroups();
      }
    }, options);

    // Find the last visible group element
    const lastGroupElement = containerRef.current?.querySelector(
      `div:nth-child(${visibleGroups})`
    );
    if (lastGroupElement) {
      observer.observe(lastGroupElement);
    }

    return () => observer.disconnect();
  }, [
    visibleGroups,
    groupedStations.length,
    isVerticalLoading,
    loadMoreGroups,
  ]);

  return (
    <Box mx="auto" ref={containerRef}>
      <Box overflow="auto">
        {groupedStations
          .slice(0, visibleGroups)
          .map(({ tag, stations }, index) => (
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
          ))}
        {visibleGroups < groupedStations.length && (
          <Box display="flex" justifyContent="center" my={4}>
            {isVerticalLoading ? (
              <Spinner size="md" color="gray.500" />
            ) : (
              <Button
                size="sm"
                colorScheme="black"
                borderRadius="full"
                onClick={loadMoreGroups}
              >
                Load More
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StationSelect;
