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
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="150px"
          height="150px"
        >
          <Spinner size="md" color="gray.500" />
        </Box>
      ) : (
        <Image
          src={imgSrc}
          borderRadius="md"
          boxSize="150px"
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

// Create a separate StationSearchRow component
const StationSearchRow = React.memo(({ station, searchTerm }) => {
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
      key={`${searchTerm}-${station.streamUrl}`}
      as="a"
      href={`/?id=${encodeUrl(station.streamUrl)}`}
      display="flex"
      gap={4}
      pt="6"
      overflow="hidden"
      textWrap="nowrap"
      textOverflow="ellipsis"
      maxW="100%"
    >
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="80px"
          height="80px"
        >
          <Spinner size="md" color="gray.500" />
        </Box>
      ) : (
        <Image
          src={imgSrc}
          borderRadius="md"
          boxSize="80px"
          alt={station.title}
          objectFit="cover"
        />
      )}
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {station.title}
        </Text>
        {station.tags && (
          <Box display="flex" gap="2" mt={2}>
            {station.tags.split(',').map((tag) => (
              <Badge
                key={tag}
                colorScheme="gray"
                variant="subtle"
                rounded={'full'}
              >
                {tag.trim()}
              </Badge>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Update the SearchResults component to use StationSearchRow
const SearchResults = React.memo(
  ({ stations, searchTerm }) => {
    const [visibleItems, setVisibleItems] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef(null);

    if (!searchTerm) return null;

    const searchTermLower = searchTerm.toLowerCase().trim();

    const filteredStations = React.useMemo(
      () =>
        stations.filter(
          (station) =>
            station.title.toLowerCase().includes(searchTermLower) ||
            station.tags?.toLowerCase().includes(searchTermLower)
        ),
      [stations, searchTermLower]
    );

    const handleLoadMore = useCallback(() => {
      if (!isLoading && filteredStations.length > visibleItems) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleItems((prev) => prev + 10);
          setIsLoading(false);
        }, 500);
      }
    }, [isLoading, filteredStations.length, visibleItems]);

    // Add scroll observer
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
          !isLoading &&
          filteredStations.length > visibleItems
        ) {
          handleLoadMore();
        }
      }, options);

      // Create a dedicated element for observation
      const loadingTriggerElement = containerRef.current?.querySelector(
        '[data-loading-trigger]'
      );
      if (loadingTriggerElement) {
        observer.observe(loadingTriggerElement);
      }

      return () => observer.disconnect();
    }, [handleLoadMore, isLoading, filteredStations.length, visibleItems]);

    return (
      <Box key={searchTerm} ref={containerRef}>
        {filteredStations.length === 0 ? (
          <Text fontSize={25} textAlign="center" mt={4}>
            No stations found for "{searchTerm}"
          </Text>
        ) : (
          <>
            <Box>
              {filteredStations.slice(0, visibleItems).map((station) => (
                <StationSearchRow
                  key={station.streamUrl}
                  station={station}
                  searchTerm={searchTerm}
                />
              ))}
            </Box>
            {filteredStations.length > visibleItems && (
              <Box
                display="flex"
                justifyContent="center"
                my={4}
                data-loading-trigger
              >
                {isLoading ? (
                  <Spinner size="md" color="gray.500" />
                ) : (
                  <Button
                    size="sm"
                    colorScheme="black"
                    borderRadius="full"
                    onClick={handleLoadMore}
                  >
                    Load More
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to ensure re-render on searchTerm change
    return (
      prevProps.searchTerm === nextProps.searchTerm &&
      prevProps.stations === nextProps.stations
    );
  }
);

const StationSelect = () => {
  const [searchTerm, setSearchTerm] = useState('');
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

      {searchTerm ? (
        <SearchResults stations={stations} searchTerm={searchTerm} />
      ) : (
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
      )}
    </Box>
  );
};

export default StationSelect;
