'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Text,
  Input,
  IconButton,
  Spinner,
  Button,
  Badge,
  Image,
} from '@chakra-ui/react';
import {
  InputGroup,
  InputRightElement,
  InputLeftElement,
} from '@chakra-ui/input';
import { IoCloseOutline } from 'react-icons/io5';
import { RiSearchLine } from 'react-icons/ri';
import { createAvatarUrl, encodeUrl } from '../utils';
import Link from 'next/link';

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
      as={Link}
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
            {station.tags
              .split(',')
              .filter((tag) => tag.trim().length <= 10)
              .slice(0, 3)
              .map((tag) => (
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

    const searchTermLower = searchTerm.toLowerCase().trim();

    const filteredStations = React.useMemo(
      () =>
        searchTerm
          ? stations.filter(
              (station) =>
                station.title.toLowerCase().includes(searchTermLower) ||
                station.tags?.toLowerCase().includes(searchTermLower)
            )
          : [],
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
        {!searchTerm ? null : filteredStations.length === 0 ? (
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

const StationSearch = ({ stations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleItems, setVisibleItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  // ... copy the SearchResults logic here ...

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
          <InputLeftElement height="100%" pointerEvents="none" ml="12">
            <RiSearchLine color="gray.500" />
          </InputLeftElement>
          <Input
            variant="subtle"
            fontSize="xl"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            colorPalette="yellow"
            paddingLeft="10"
            autoFocus
          />
          {searchTerm && (
            <InputRightElement
              onClick={() => setSearchTerm('')}
              height="100%"
              mr="12"
              cursor="pointer"
            >
              <IoCloseOutline />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>

      <SearchResults stations={stations} searchTerm={searchTerm} />
    </Box>
  );
};

export default StationSearch;
