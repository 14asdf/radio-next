'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from 'react';
import { findStation, decodeUrl, encodeUrl } from '../utils';
import _ from 'lodash';
import s from '../stations.json';

const stations = _.uniqBy(s, 'title');

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    currentStation: null,
    volume: 1,
  });

  const audioRef = useRef(null);

  const handlePlay = useCallback((station) => {
    if (audioRef.current) {
      audioRef.current.play();
    }

    setPlayerState((prev) => ({
      ...prev,
      isPlaying: true,
      currentStation: station,
    }));

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
  }, []);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = (audioId) => {
    const audioSrc = decodeUrl(audioId);
    const station = findStation(audioId, stations);
    const isNewStation =
      playerState.currentStation === null ||
      encodeUrl(playerState.currentStation.streamUrl) !== audioId;

    if (audioRef.current) {
      if (isNewStation) {
        // New station - always play
        audioRef.current.src = audioSrc;
        handlePlay(station);
      } else {
        // Same station - toggle play state
        if (playerState.isPlaying) {
          handlePause();
        } else {
          handlePlay(station);
        }
      }
    }
  };

  const handleVolumeChange = useCallback((newVolume) => {
    // Ensure volume is a number and within valid range (0-1)
    const validVolume = Math.min(Math.max(Number(newVolume) || 0, 0), 1);

    setPlayerState((prev) => ({ ...prev, volume: validVolume }));
    if (audioRef.current) {
      audioRef.current.volume = validVolume;
    }
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        playerState,
        togglePlay,
        audioRef,
        stations,
        handleVolumeChange,
      }}
    >
      <audio
        ref={audioRef}
        onPlay={() => handlePlay(playerState.currentStation)}
        onPause={handlePause}
        onError={(e) => console.error('Audio playback error:', e)}
        volume={playerState.volume}
      />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioPlayerContext);
