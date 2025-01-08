'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from 'react';
import { findStation, decodeUrl, encodeUrl } from '../utils';
import { useStations } from './StationsContext';

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const { stations } = useStations();
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    currentStation: null,
    volume: 1,
  });

  const audioRef = useRef(null);

  const handlePlay = useCallback(async (station) => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setPlayerState((prev) => ({
          ...prev,
          isPlaying: true,
          currentStation: station,
        }));

        if ('mediaSession' in navigator && station) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: station.title || 'Unknown Station',
            artist: 'Radio cloud',
            album: 'Live Streaming',
            artwork: [
              {
                src:
                  station?.img ||
                  'https://sun9-67.userapi.com/impg/VMeLVKW007WoGlxbwzFWPTpgqibq6gf_xebhfA/_4cpdXADUbA.jpg?size=500x500&quality=96&sign=50831e64c37110086e0203474f6f643a&type=album',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          });
        }
      } catch (error) {
        console.warn('Playback failed:', error);
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      }
    }
  }, []);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = async (audioId) => {
    const audioSrc = decodeUrl(audioId);
    const station = findStation(audioId, stations);
    const isNewStation =
      playerState.currentStation === null ||
      encodeUrl(playerState.currentStation.streamUrl) !== audioId;

    if (audioRef.current) {
      try {
        if (isNewStation) {
          // Update player state before changing audio source
          setPlayerState((prev) => ({
            ...prev,
            currentStation: station,
            isPlaying: true,
          }));
          await audioRef.current.pause();
          audioRef.current.src = audioSrc;
          handlePlay(station);
        } else {
          if (playerState.isPlaying) {
            handlePause();
          } else {
            handlePlay(station);
          }
        }
      } catch (error) {
        console.warn('Toggle play failed:', error);
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
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
