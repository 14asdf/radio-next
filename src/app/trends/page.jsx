'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Heading,
  Container,
  SimpleGrid,
  Text,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { ref, get } from 'firebase/database';
import { db } from '@/firebase/config';
import StationSearchRow from '@/components/StationSearchRow';
import { useStations } from '@/contexts/StationsContext';
import { AvatarGroup, Avatar } from '@/components/ui/avatar';
import { encodeUrl } from '@/utils';

export default function TrendsPage() {
  const [trendingStations, setTrendingStations] = useState([]);
  const [displayedStations, setDisplayedStations] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { stations } = useStations();
  const stationsPerPage = 20;
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchTrendingStations = async () => {
      // Get all favorites from RTDB
      const favoritesRef = ref(db, 'favorites');
      const favoritesSnapshot = await get(favoritesRef);
      const favoritesData = favoritesSnapshot.val() || {};

      // Get all users data
      const usersRef = ref(db, 'users');
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val() || {};

      // Create a map to count favorites per station
      const stationCounts = new Map();
      const usersByStation = new Map();

      // Process favorites data
      Object.entries(favoritesData).forEach(([userId, userData]) => {
        const favorites = userData.favorites || [];
        const user = usersData[userId] || {};

        favorites.forEach((stationId) => {
          stationCounts.set(stationId, (stationCounts.get(stationId) || 0) + 1);
          if (!usersByStation.has(stationId)) {
            usersByStation.set(stationId, []);
          }
          usersByStation.get(stationId).push({
            userId,
            userPhotoURL: user.photoURL || null,
            displayName: user.name || `User ${userId.slice(0, 4)}`,
          });
        });
      });

      // Filter stations with 1 or more favorites
      const trendingStationIds = Array.from(stationCounts.entries())
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([stationId]) => stationId);

      // Convert stations array to a map of url -> station
      const stationsMap = stations.reduce((acc, station) => {
        const encodedUrl = encodeUrl(station.streamUrl);
        acc[encodedUrl] = station;
        return acc;
      }, {});

      const filteredStations = trendingStationIds
        .filter((id) => stationsMap[id])
        .map((id) => ({
          id,
          ...stationsMap[id],
          users: usersByStation.get(id) || [],
          favoriteCount: stationCounts.get(id),
        }));

      setTrendingStations(filteredStations);
    };

    fetchTrendingStations();
  }, [stations]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const nextStations = trendingStations.slice(
        displayedStations.length,
        displayedStations.length + stationsPerPage
      );

      if (nextStations.length > 0) {
        setDisplayedStations((prev) => [...prev, ...nextStations]);
      }
      if (nextStations.length < stationsPerPage) {
        setHasMore(false);
      }
      setIsLoadingMore(false);
    }, 100);
  }, [isLoadingMore, hasMore, trendingStations, displayedStations.length]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const lastEntry = entries[0];
      if (lastEntry.isIntersecting && !isLoadingMore && hasMore) {
        handleLoadMore();
      }
    }, options);

    const loadingTriggerElement = containerRef.current?.querySelector(
      '[data-loading-trigger]'
    );
    if (loadingTriggerElement) {
      observer.observe(loadingTriggerElement);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, isLoadingMore, hasMore]);

  useEffect(() => {
    setDisplayedStations([]);
    setHasMore(true);

    const initialStations = trendingStations.slice(0, stationsPerPage);
    setDisplayedStations(initialStations);
    setHasMore(initialStations.length === stationsPerPage);
  }, [trendingStations]);

  return (
    <Box
      w="100%"
      minH="100vh"
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
      borderBottomRadius={16}
    >
      <Box
        position="relative"
        h="300px"
        w="100%"
        bg="purple.500"
        backgroundSize="cover"
        backgroundPosition="center"
        borderTopRadius={16}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 100%)"
          _dark={{
            bg: 'linear-gradient(180deg, rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.95) 100%)',
          }}
          pointerEvents="none"
        />

        <Container maxW="container.xl" h="100%" position="relative">
          <Heading
            position="absolute"
            bottom="40px"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
          >
            Trending Stations
          </Heading>
        </Container>
      </Box>

      <Container maxW="container.xl" py={6} ref={containerRef}>
        {displayedStations.map((station) => (
          <Box key={station.id} overflow="hidden" p={4} transition="all 0.2s">
            <StationSearchRow station={station} />
            <Box mt={4}>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: 'gray.300' }}
              >
                Favorited by {station.favoriteCount} users
              </Text>
              <AvatarGroup size="sm" max={3} mt={2}>
                {station.users.map((user, index) => (
                  <Avatar
                    key={index}
                    src={user.userPhotoURL}
                    name={user.displayName}
                  />
                ))}
              </AvatarGroup>
            </Box>
          </Box>
        ))}

        {(hasMore || isLoadingMore) && (
          <Box
            display="flex"
            justifyContent="center"
            mt={4}
            data-loading-trigger
          >
            {isLoadingMore ? (
              <Spinner size="md" color="gray.500" />
            ) : (
              <Button
                onClick={handleLoadMore}
                size="sm"
                colorScheme="black"
                borderRadius="full"
              >
                Load More
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
