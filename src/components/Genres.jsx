'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Container,
  Text,
  IconButton,
  VStack,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useStations } from '@/contexts/StationsContext';
import StationSearchRow from '@/components/StationSearchRow';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { getGenreColor } from '@/utils/colors';
import { useTranslations } from 'next-intl';

const Genre = () => {
  const params = useParams();
  const router = useRouter();
  const { tag } = params;
  const { stations } = useStations();
  const t = useTranslations('genres');

  const genreStations = useMemo(() => {
    if (!stations || !tag) return [];

    return stations.filter((station) =>
      station.tags
        ?.toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .includes(decodeURIComponent(tag).toLowerCase())
    );
  }, [stations, tag]);

  const bgColor = useMemo(() => getGenreColor(tag), []);

  const handleBack = () => {
    router.push('/');
  };

  const [displayedStations, setDisplayedStations] = useState([]);
  const stationsPerPage = 20;

  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const nextStations = genreStations.slice(
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
  }, [isLoadingMore, hasMore, genreStations, displayedStations.length]);

  const containerRef = useRef(null);

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
    setIsLoadingMore(true);

    const initialStations = genreStations.slice(0, stationsPerPage);
    setDisplayedStations(initialStations);
    setHasMore(initialStations.length === stationsPerPage);
    setIsLoadingMore(false);
  }, [genreStations, stationsPerPage]);

  const translationKey = useMemo(() => {
    const decodedTag = decodeURIComponent(tag || '');
    return decodedTag.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }, [tag]);

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
        bg={bgColor}
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
          <IconButton
            position="absolute"
            top="40px"
            left="20px"
            onClick={handleBack}
            variant="ghost"
            aria-label="Go back"
            borderRadius="full"
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            <IoArrowBackSharp size={24} />
          </IconButton>

          <Box position="absolute" bottom="40px">
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="bold"
              textTransform="capitalize"
            >
              {t(translationKey)}
            </Heading>
            <Text mt={2} fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
              {t('stationCount', { count: genreStations.length })}
            </Text>
          </Box>
        </Container>
      </Box>

      <Container maxW="container.xl" py={6} ref={containerRef}>
        {genreStations.length === 0 ? (
          <Text color="gray.600" _dark={{ color: 'gray.300' }}>
            No stations found for this genre.
          </Text>
        ) : (
          <>
            <VStack gap={4} align="stretch">
              {displayedStations.map((station, index) => (
                <StationSearchRow
                  key={`${station.streamUrl}-${index}`}
                  station={station}
                />
              ))}
            </VStack>

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
                    {t('loadMore')}
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Genre;
