'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Container,
  Text,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { useStations } from '@/contexts/StationsContext';
import StationSearchRow from '@/components/StationSearchRow';
import { useMemo } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { getGenreColor } from '@/utils/colors';

const GenrePage = () => {
  const params = useParams();
  const router = useRouter();
  const { tag } = params;
  const { stations } = useStations();

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

  const bgColor = useMemo(() => getGenreColor(), []);

  const handleBack = () => {
    router.back();
  };

  return (
    <Box w="100%" minH="100vh" bg="gray.900">
      <Box
        position="relative"
        h="300px"
        w="100%"
        bg={bgColor}
        backgroundSize="cover"
        backgroundPosition="center"
      >
        <Box
          position="absolute"
          bottom="0"
          w="100%"
          h="100%"
          bgGradient="linear(to-b, transparent 40%, rgba(0,0,0,0.8) 80%, gray.900 100%)"
        />

        <Container maxW="container.xl" h="100%" position="relative">
          <IconButton
            position="absolute"
            top="40px"
            left="0"
            onClick={handleBack}
            variant="ghost"
            aria-label="Go back"
            color="white"
            borderRadius="full"
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            <IoArrowBackSharp size={24} />
          </IconButton>

          <Heading
            position="absolute"
            bottom="20px"
            color="white"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
            textTransform="capitalize"
          >
            {decodeURIComponent(tag || '')}
          </Heading>
        </Container>
      </Box>

      <Container maxW="container.xl" py={6}>
        {genreStations.length === 0 ? (
          <Text color="gray.300">No stations found for this genre.</Text>
        ) : (
          <VStack spacing={2} align="stretch">
            {genreStations.map((station) => (
              <StationSearchRow key={station.streamUrl} station={station} />
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default GenrePage;
