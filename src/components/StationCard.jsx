import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { RiPlayFill } from 'react-icons/ri';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { createAvatarUrl, encodeUrl } from '../utils';

const StationCard = ({ station }) => {
  const { playerState, togglePlay } = useAudioPlayer();
  const isPlaying =
    playerState.isPlaying &&
    playerState.audioId === encodeUrl(station.streamUrl);

  const handlePlay = (e) => {
    e.preventDefault();
    const audioId = encodeUrl(station.streamUrl);
    togglePlay(audioId);
  };

  return (
    <Box
      onClick={handlePlay}
      cursor="pointer"
      position="relative"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
      }}
    >
      <Box position="relative" paddingBottom="100%">
        <Image
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          src={station.img || createAvatarUrl(station.title)}
          alt={station.title}
          objectFit="cover"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          opacity={isPlaying ? 1 : 0}
          transition="opacity 0.2s"
          _hover={{ opacity: 1 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <RiPlayFill color="white" size="40px" />
        </Box>
      </Box>
      <VStack p={4} bg="white" align="start" spacing={1}>
        <Text fontWeight="bold" noOfLines={1}>
          {station.title}
        </Text>
        {station.subtitle && (
          <Text fontSize="sm" color="gray.600" noOfLines={1}>
            {station.subtitle}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default StationCard;
