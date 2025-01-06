'use client';

import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner, Badge, Image } from '@chakra-ui/react';
import { RiPlayFill } from 'react-icons/ri';
import Link from 'next/link';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { createAvatarUrl, encodeUrl } from '../utils';

const StationSearchRow = React.memo(({ station, searchTerm }) => {
  const [imgSrc, setImgSrc] = useState(createAvatarUrl(station.title));
  const [isLoading, setIsLoading] = useState(true);
  const { togglePlay } = useAudioPlayer();

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

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const audioId = encodeUrl(station.streamUrl);
    togglePlay(audioId);
  };

  return (
    <Box
      key={`${searchTerm}-${station.streamUrl}`}
      as={Link}
      href={`/?id=${encodeUrl(station.streamUrl)}`}
      display="flex"
      gap={4}
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
        <Box position="relative" onClick={handlePlayClick}>
          <Image
            src={imgSrc}
            borderRadius="md"
            boxSize="80px"
            alt={station.title}
            objectFit="cover"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="blackAlpha.600"
            borderRadius="md"
            opacity="0"
            _hover={{ opacity: 1 }}
            transition="opacity 0.2s"
          >
            <RiPlayFill color="white" size="30px" />
          </Box>
        </Box>
      )}
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {station.title}
        </Text>
        {station.tags && (
          <Box display="flex" gap="2" mt={2}>
            {station.tags
              .split(',')
              .filter((tag) => tag.trim().length <= 10 && tag.length > 3)
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

export default StationSearchRow;
