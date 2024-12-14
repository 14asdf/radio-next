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
import {
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from 'react-icons/io5';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';
import 'swiper/css/free-mode';

const stations = _.uniqBy(s, 'title');

const StationGroupRow = React.memo(
  ({ tag, stations, visibleItems, isLoading, onLoadMore }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const scrollbarRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [swiper, setSwiper] = useState(null);

    // Add resize handler
    useEffect(() => {
      if (!swiper || typeof window === 'undefined') return;

      const handleResize = _.debounce(() => {
        if (swiper?.scrollbar?.updateSize) {
          swiper.scrollbar.updateSize();
          swiper.update();
        }
      }, 200);

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        handleResize.cancel();
      };
    }, [swiper]);

    // Update navigation when refs change
    useEffect(() => {
      if (!swiper) return;

      // Initialize navigation parameters
      if (swiper.params) {
        Object.assign(swiper.params, {
          navigation: {
            ...swiper.params.navigation,
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          },
          scrollbar: {
            ...swiper.params.scrollbar,
            el: scrollbarRef.current,
          },
        });
      }

      // Initialize and update navigation
      const { navigation, scrollbar } = swiper;

      if (navigation?.init && navigation?.update) {
        navigation.init();
        navigation.update();
      }

      // Initialize and update scrollbar
      if (scrollbar?.init && scrollbar?.updateSize) {
        scrollbar.init();
        scrollbar.updateSize();
      }

      swiper.update();
    }, [swiper]);

    return (
      <Box position="relative" overflow="visible">
        <Swiper
          modules={[Navigation, Scrollbar, A11y, FreeMode]}
          spaceBetween={16}
          slidesPerView={'auto'}
          slidesPerGroup={5}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          scrollbar={{
            el: scrollbarRef.current,
            draggable: true,
            hide: false,
          }}
          speed={600}
          onSwiper={setSwiper}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 1.5,
            momentumVelocityRatio: 1,
            minimumVelocity: 0.001,
            sticky: false,
            momentumBounce: false,
          }}
          onProgress={(swiper, progress) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);

            if (swiper.progress > 0.97) {
              onLoadMore(tag);
            }
          }}
          watchSlidesProgress={true}
          className="station-swiper"
          style={{
            padding: '0 1px',
            paddingBottom: '24px',
          }}
        >
          {stations.slice(0, visibleItems).map((station) => (
            <SwiperSlide key={station.streamUrl} style={{ width: 'auto' }}>
              <StationRow station={station} />
            </SwiperSlide>
          ))}
          {stations.length > visibleItems && (
            <SwiperSlide style={{ width: 'auto' }}>
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
                  <Button
                    size="sm"
                    colorScheme="black"
                    borderRadius="full"
                    onClick={() => onLoadMore(tag)}
                  >
                    Load More
                  </Button>
                )}
              </Box>
            </SwiperSlide>
          )}
        </Swiper>

        {/* Custom scrollbar */}
        <Box
          ref={scrollbarRef}
          position="absolute"
          bottom="8px"
          left="0"
          right="0"
          height="4px"
          zIndex={999}
          borderRadius={'full'}
          background="gray.100"
          _dark={{ background: 'gray.700' }}
          css={{
            '.swiper-scrollbar-drag': {
              background: 'var(--chakra-colors-gray-300)',
              '[data-theme="dark"] &': {
                background: 'var(--chakra-colors-gray-600)',
              },
            },
          }}
        />

        {/* Previous button */}
        <IconButton
          ref={prevRef}
          aria-label="Previous"
          position="absolute"
          left="-20px"
          top="50%"
          transform="translateY(calc(-50% - 28.5px))"
          zIndex={1000}
          borderRadius="full"
          size="sm"
          display={{ base: 'none', md: isBeginning ? 'none' : 'flex' }}
        >
          <IoChevronBackOutline />
        </IconButton>

        {/* Next button */}
        <IconButton
          ref={nextRef}
          aria-label="Next"
          position="absolute"
          right="-20px"
          top="50%"
          transform="translateY(calc(-50% - 28.5px))"
          zIndex={1000}
          borderRadius="full"
          size="sm"
          display={{ base: 'none', md: isEnd ? 'none' : 'flex' }}
        >
          <IoChevronForwardOutline />
        </IconButton>
      </Box>
    );
  }
);

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
      // to={`/?id=${encodeUrl(station.streamUrl)}`}
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
        }, 100);
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
        }, 100);
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
    }, 100);
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
    <Box mx="auto" ref={containerRef} overflow="visible">
      <Box overflow="visible">
        {groupedStations
          .slice(0, visibleGroups)
          .map(({ tag, stations }, index) => (
            <Box key={tag} mb={6} overflow="visible">
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
