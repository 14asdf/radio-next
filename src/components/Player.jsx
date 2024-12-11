'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Image,
  Text,
  IconButton,
  Separator,
  Badge,
  Stack,
  HStack,
} from '@chakra-ui/react';
import { IoPlayOutline } from 'react-icons/io5';
import { IoPauseOutline } from 'react-icons/io5';
import { IoPlayBackOutline, IoPlayForwardOutline } from 'react-icons/io5';

import { encodeUrl, decodeUrl, findStation, generateUUID } from '../utils'; // Assuming utility functions are in utils.js
import Share from './Share';
import s from '../stations.json';
import _ from 'lodash';
import { VscRefresh } from 'react-icons/vsc';
import { IoCloseOutline } from 'react-icons/io5';
import { Avatar, AvatarGroup } from './ui/avatar';

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const stations = _.uniqBy(s, 'title');

const Player = ({ audioId }) => {
  const audioSrc = React.useMemo(() => decodeUrl(audioId), [audioId]);
  const station = React.useMemo(
    () => (audioSrc ? findStation(audioId, stations) : null),
    [audioId, audioSrc]
  );
  const usedColors = React.useRef(new Set());

  const [playerState, setPlayerState] = React.useState({
    isDialogOpen: false,
    isPlaying: false,
  });

  const audioRef = useRef(null);

  const [avatarDimensions, setAvatarDimensions] = React.useState({
    width: '100%',
    height: 'auto',
  });

  const currentIndex = React.useMemo(() => {
    return stations.findIndex((s) => decodeUrl(audioId) === s.streamUrl);
  }, [audioId]);

  const navigate = (direction) => {
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % stations.length;
    } else {
      newIndex = (currentIndex - 1 + stations.length) % stations.length;
    }
    const newStation = stations[newIndex];

    return `/?id=${encodeUrl(newStation.streamUrl)}`;
  };

  const handlePlay = React.useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying: true }));

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.title,
        artist: 'Online Radio',
        album: 'Live Streaming',
        artwork: [
          {
            src:
              station.img ||
              'https://sun9-67.userapi.com/impg/VMeLVKW007WoGlxbwzFWPTpgqibq6gf_xebhfA/_4cpdXADUbA.jpg?size=500x500&quality=96&sign=50831e64c37110086e0203474f6f643a&type=album',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      });
    }
  }, [station]);

  const handlePause = () => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  };

  const handleError = React.useCallback((e) => {
    console.error('Audio playback error:', e);
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (playerState.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };
  const colorPalette = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  const pickPalette = (name) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  const badges = React.useMemo(() => {
    return station.tags.split(',').map((tag) => {
      let color;
      if (usedColors.current.size === 9) {
        usedColors.current.clear(); // Reset the used colors
      }
      do {
        color = [
          'red',
          'orange',
          'yellow',
          'green',
          'teal',
          'blue',
          'cyan',
          'purple',
          'pink',
        ][Math.floor(Math.random() * 9)];
      } while (usedColors.current.has(color));

      usedColors.current.add(color);

      return (
        <Badge key={tag} colorPalette={color} borderRadius="full">
          {tag.trim()}
        </Badge>
      );
    });
  }, [station.tags]);

  return (
    <>
      <DialogRoot
        open={playerState.isDialogOpen}
        onOpenChange={(e) =>
          setPlayerState((prev) => ({ ...prev, isDialogOpen: e.open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle _dark={{ color: '#fff' }}>{station.title}</DialogTitle>
            <DialogCloseTrigger>
              <IoCloseOutline />
            </DialogCloseTrigger>
          </DialogHeader>
          <DialogBody>
            <Avatar
              name={station.title}
              shape="rounded"
              src={station.img}
              alt={station.title}
              colorPalette={pickPalette(station.title)}
              width={avatarDimensions.width}
              height={avatarDimensions.height}
              onStatusChange={(e) => {
                if (e.status === 'error') {
                  setAvatarDimensions({ width: '100%', height: '512px' });
                }
              }}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      <Box
        display="flex"
        justifyContent="center"
        position="relative"
        width="250px" // Match Avatar width
        margin="0 auto" // Center the box
        mb="1em"
      >
        <Avatar
          src={station.img}
          shape="rounded"
          width="250px"
          height="250px"
          name={station.title}
          cursor="pointer"
          onClick={() =>
            setPlayerState((prev) => ({ ...prev, isDialogOpen: true }))
          }
          colorPalette={pickPalette(station.title)}
        />
        <Box position="absolute" right="-1em" bottom="-1em">
          <Share />
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom="1em"
      >
        <Box display="inline-flex" alignItems="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            overflow="hidden"
            textOverflow="ellipsis"
            textWrap="nowrap"
            maxW={{ base: '250px', md: '400px' }}
          >
            {station.title}
          </Text>
        </Box>
      </Box>
      <Box position="relative">
        <Stack
          display="flex"
          alignItems="center"
          justifyContent="center"
          direction="row"
          maxW="100%"
          spacing={2}
          maxH="80px"
          overflowX="auto"
          flexWrap="nowrap"
        >
          {badges}
        </Stack>

        <audio
          ref={audioRef}
          src={audioSrc}
          onPlay={handlePlay}
          onPause={handlePause}
          onError={handleError}
        />

        <Box display="flex" justifyContent="center" marginTop="1em">
          <HStack spacing={4}>
            <IconButton
              aria-label="Previous"
              as="a"
              href={navigate('prev')}
              variant="subtle"
              colorPalette="yellow"
              boxSize={{ base: '40px', md: '60px' }}
              rounded={'full'}
            >
              <IoPlayBackOutline />
            </IconButton>

            <IconButton
              aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              variant="subtle"
              colorPalette="yellow"
              boxSize={{ base: '60px', md: '80px' }}
              rounded={'full'}
            >
              {playerState.isPlaying ? <IoPauseOutline /> : <IoPlayOutline />}
            </IconButton>

            <IconButton
              aria-label="Next"
              as="a"
              href={navigate('next')}
              variant="subtle"
              colorPalette="yellow"
              boxSize={{ base: '40px', md: '60px' }}
              rounded={'full'}
            >
              <IoPlayForwardOutline />
            </IconButton>
          </HStack>
        </Box>
      </Box>
    </>
  );
};

export default React.memo(Player);
