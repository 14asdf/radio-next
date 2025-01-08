'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Heading,
  Container,
  SimpleGrid,
  Text,
  Spinner,
  Button,
  Badge,
} from '@chakra-ui/react';
import { ref, get } from 'firebase/database';
import { db } from '@/firebase/config';
import StationSearchRow from '@/components/StationSearchRow';
import { useStations } from '@/contexts/StationsContext';
import { AvatarGroup, Avatar } from '@/components/ui/avatar';
import { encodeUrl } from '@/utils';
import { AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';
import { MenuRoot, MenuTrigger, MenuContent } from '@/components/ui/menu';
import { sampleSize } from 'lodash';

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Get all elements in the event path
      const path =
        event.composedPath?.() ||
        event.path ||
        (event.target.ownerDocument || document).elementsFromPoint(
          event.clientX,
          event.clientY
        );

      // Check if any element in the path is a menu trigger or menu content
      const isMenuElement = path.some((element) => {
        const role = element.getAttribute?.('role');
        return role === 'button' || role === 'menu';
      });

      if (isMenuElement) {
        return;
      }

      // Check if click is outside
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // Add small delay to prevent race condition
      setTimeout(() => {
        handler();
      }, 0);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function TrendsPage() {
  const [trendingStations, setTrendingStations] = useState([]);
  const [displayedStations, setDisplayedStations] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [usersData, setUsersData] = useState({});
  const { stations } = useStations();
  const stationsPerPage = 20;
  const containerRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const likesMenuRef = useRef(null);
  const commentsMenuRef = useRef(null);

  useClickOutside(likesMenuRef, () => setActiveMenu(null));
  useClickOutside(commentsMenuRef, () => setActiveMenu(null));

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
      setUsersData(usersData);

      // Get all comments data
      const commentsRef = ref(db, 'comments');
      const commentsSnapshot = await get(commentsRef);
      const commentsData = commentsSnapshot.val() || {};

      // Create maps for data
      const stationCounts = new Map();
      const usersByStation = new Map();
      const commentsByStation = new Map();
      const commentCountByStation = new Map();

      // Process favorites data
      Object.entries(favoritesData).forEach(([userId, userData]) => {
        const favorites = userData.favorites || [];
        favorites.forEach((stationId) => {
          if (!usersByStation.has(stationId)) {
            usersByStation.set(stationId, new Set());
          }
          usersByStation.get(stationId).add(userId);
        });
      });

      // Convert Sets to arrays and get counts
      usersByStation.forEach((userSet, stationId) => {
        stationCounts.set(stationId, userSet.size);
      });

      // Process comments data and ensure stations with only comments are included
      Object.entries(commentsData).forEach(([stationId, stationData]) => {
        const { commentCount, ...comments } = stationData;
        const commentsList = Object.entries(comments || {})
          .filter(([key]) => key !== 'commentCount')
          .map(([key, value]) => ({
            ...value,
            key,
          }));
        commentsByStation.set(stationId, commentsList);
        commentCountByStation.set(stationId, commentCount || 0);

        // Add station to stationCounts if it's not already there
        if (!stationCounts.has(stationId)) {
          stationCounts.set(stationId, 0);
        }
      });

      // Convert stations array to a map
      const stationsMap = stations.reduce((acc, station) => {
        const encodedUrl = encodeUrl(station.streamUrl);
        acc[encodedUrl] = station;
        return acc;
      }, {});

      // Get trending stations
      const trendingStationIds = Array.from(stationCounts.keys()).sort(
        (a, b) => {
          const likesA = stationCounts.get(a) || 0;
          const likesB = stationCounts.get(b) || 0;
          const commentsA = commentCountByStation.get(a) || 0;
          const commentsB = commentCountByStation.get(b) || 0;

          // Calculate total engagement (likes + comments)
          const totalEngagementA = likesA + commentsA;
          const totalEngagementB = likesB + commentsB;

          return totalEngagementB - totalEngagementA;
        }
      );

      const filteredStations = trendingStationIds
        .filter((id) => stationsMap[id])
        .map((id) => ({
          id,
          ...stationsMap[id],
          users: Array.from(usersByStation.get(id) || new Set()).map(
            (userId) => ({
              userId,
              userPhotoURL: usersData[userId]?.photoURL || null,
              displayName:
                usersData[userId]?.name || `User ${userId.slice(0, 4)}`,
            })
          ),
          favoriteCount: stationCounts.get(id) || 0,
          commentCount: commentCountByStation.get(id) || 0,
          comments: commentsByStation.get(id) || [],
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

  // Memoize sampled users for all stations
  const sampledUsersMap = useMemo(() => {
    const maxAvatars = 5;
    return displayedStations.reduce((acc, station) => {
      // Handle likes users
      acc[`likes-${station.id}`] = sampleSize(station.users || [], maxAvatars);

      // Handle comments users
      acc[`comments-${station.id}`] = Array.from(
        new Set(
          (station.comments || [])
            .filter((comment) => comment.userId)
            .map((comment) => comment.userId)
        )
      )
        .slice(0, maxAvatars)
        .map((userId) => ({
          userId,
          userPhotoURL: usersData[userId]?.photoURL,
          displayName: usersData[userId]?.name || 'Anonymous',
        }));

      return acc;
    }, {});
  }, [displayedStations, usersData]);

  const renderAvatarStack = useCallback(
    (menuId) => {
      const maxAvatars = 5;
      const users = sampledUsersMap[menuId] || [];

      return (
        <Box p={2}>
          <AvatarGroup size="sm" max={maxAvatars}>
            {users.map((user) => (
              <Avatar
                key={user.userId}
                src={user.userPhotoURL}
                name={user.displayName}
              />
            ))}
            {users.length > maxAvatars && (
              <Avatar
                name={`+${users.length - maxAvatars}`}
                bg="gray.100"
                _dark={{ bg: 'gray.700' }}
              />
            )}
          </AvatarGroup>
        </Box>
      );
    },
    [sampledUsersMap]
  );

  const handleMenuOpen = (menuId) => {
    // If the same menu is clicked, close it after a small delay
    if (activeMenu === menuId) {
      setTimeout(() => {
        setActiveMenu(null);
      }, 100);
    } else {
      // If a different menu is clicked, update immediately
      setActiveMenu(menuId);
    }
  };

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
              <Box fontSize="sm" display="flex" alignItems="center" gap={2}>
                {station.favoriteCount > 0 && (
                  <MenuRoot
                    open={activeMenu === `likes-${station.id}`}
                    onOpenChange={(open) => {
                      if (!open) {
                        setActiveMenu(null);
                      }
                    }}
                  >
                    <MenuTrigger asChild>
                      <Badge
                        ref={likesMenuRef}
                        display="flex"
                        alignItems="center"
                        bg="gray.100"
                        _dark={{ bg: 'gray.800' }}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="bold"
                        cursor="pointer"
                        _hover={{ bg: 'gray.200', _dark: { bg: 'gray.700' } }}
                        onClick={() => handleMenuOpen(`likes-${station.id}`)}
                      >
                        <AiOutlineHeart
                          size={16}
                          style={{ marginRight: '6px' }}
                        />
                        {station.favoriteCount}
                      </Badge>
                    </MenuTrigger>
                    <MenuContent
                      rounded="xl"
                      style={{ width: 'fit-content', minWidth: 'auto' }}
                    >
                      {renderAvatarStack(`likes-${station.id}`)}
                    </MenuContent>
                  </MenuRoot>
                )}

                {station.commentCount > 0 && (
                  <MenuRoot
                    open={activeMenu === `comments-${station.id}`}
                    onOpenChange={(open) => {
                      if (!open) {
                        setActiveMenu(null);
                      }
                    }}
                  >
                    <MenuTrigger asChild>
                      <Badge
                        ref={commentsMenuRef}
                        display="flex"
                        alignItems="center"
                        bg="gray.100"
                        _dark={{ bg: 'gray.800' }}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="bold"
                        cursor="pointer"
                        _hover={{ bg: 'gray.200', _dark: { bg: 'gray.700' } }}
                        onClick={() => handleMenuOpen(`comments-${station.id}`)}
                      >
                        <AiOutlineComment
                          color="currentColor"
                          size={16}
                          style={{ marginRight: '6px' }}
                        />
                        {station.commentCount}
                      </Badge>
                    </MenuTrigger>
                    <MenuContent
                      rounded="xl"
                      style={{ width: 'fit-content', minWidth: 'auto' }}
                    >
                      {renderAvatarStack(`comments-${station.id}`)}
                    </MenuContent>
                  </MenuRoot>
                )}
              </Box>
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
