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
  Tabs,
} from '@chakra-ui/react';
import {
  InputGroup,
  InputRightElement,
  InputLeftElement,
} from '@chakra-ui/input';
import { IoCloseOutline } from 'react-icons/io5';
import { RiSearchLine, RiPlayFill } from 'react-icons/ri';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStations } from '@/contexts/StationsContext';
import StationSearchRow from '@/components/StationSearchRow';
import { debounce } from 'lodash';

const SearchResults = React.memo(
  () => {
    const { stations } = useStations();
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const searchType = searchParams.get('type') || 'all';

    const [visibleItems, setVisibleItems] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);

    const searchTermLower = searchTerm.toLowerCase().trim();

    const filteredStations = React.useMemo(() => {
      if (!searchTerm) return [];

      return stations.filter((station) => {
        switch (searchType) {
          case 'name':
            return station.title.toLowerCase().includes(searchTermLower);
          case 'genre':
            return station.tags?.toLowerCase().includes(searchTermLower);
          default: // 'all'
            return (
              station.title.toLowerCase().includes(searchTermLower) ||
              station.tags?.toLowerCase().includes(searchTermLower)
            );
        }
      });
    }, [stations, searchTermLower, searchType]);

    const handleLoadMore = useCallback(() => {
      if (!isLoading && filteredStations.length > visibleItems) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleItems((prev) => prev + 10);
          setIsLoading(false);
        }, 100);
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
            No
            {searchType === 'all'
              ? ' stations '
              : searchType === 'name'
              ? ' station names '
              : ' genres '}
            found for "{searchTerm}"
          </Text>
        ) : (
          <>
            <Box display="flex" flexDirection="column" gap={6}>
              {filteredStations.slice(0, visibleItems).map((station, index) => (
                <StationSearchRow
                  key={`${station.streamUrl}-${index}`}
                  station={station}
                  searchTerm={searchTerm}
                />
              ))}
            </Box>
            {filteredStations.length > visibleItems && (
              <Box display="flex" justifyContent="center" data-loading-trigger>
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
    // Only need to compare stations prop now
    return prevProps.stations === nextProps.stations;
  }
);

export default function SearchPage() {
  const { stations } = useStations();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const containerRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  useEffect(() => {
    const queryTerm = searchParams.get('q') || '';
    const queryType = searchParams.get('type') || 'all';
    setSearchTerm(queryTerm);
    setSearchType(queryType);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term, type) => {
      const params = new URLSearchParams();
      if (term) params.set('q', term);
      if (type !== 'all') params.set('type', type);
      router.push(`/search?${params.toString()}`);
    }, 300),
    [router]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    debouncedSearch(newTerm, searchType);
  };

  // Handle search type change
  const handleTypeChange = (newType) => {
    setSearchType(newType);
    debouncedSearch(searchTerm, newType);
  };

  return (
    <Box mx="auto" ref={containerRef}>
      <Box
        position="sticky"
        top={0}
        bg="inherit"
        zIndex={1}
        pb={5}
        pt={1}
        background={{
          base: 'var(--chakra-colors-white)',
          _dark: { base: 'var(--chakra-colors-black)' },
        }}
      >
        <Box display="flex" gap={2}>
          <InputGroup>
            <InputLeftElement height="100%" pointerEvents="none" ml="12">
              <RiSearchLine color="gray.500" />
            </InputLeftElement>
            <Input
              variant="subtle"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              paddingLeft="10"
              autoFocus
              _focus={{
                boxShadow: 'none',
                border: 'none',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <InputRightElement
                onClick={() => {
                  setSearchTerm('');
                  debouncedSearch('', searchType);
                }}
                height="100%"
                mr="12"
                cursor="pointer"
              >
                <IoCloseOutline />
              </InputRightElement>
            )}
          </InputGroup>
        </Box>

        <Tabs.Root
          value={searchType}
          onValueChange={(e) => handleTypeChange(e.value)}
          mt={2}
          style={{ width: '100%' }}
        >
          <Tabs.List
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Tabs.Trigger
              value="all"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              All
            </Tabs.Trigger>
            <Tabs.Trigger
              value="name"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Name
            </Tabs.Trigger>
            <Tabs.Trigger
              value="genre"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Genre
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </Box>

      <SearchResults />
    </Box>
  );
}
