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
    isLoading: false,
  });

  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isLoadingRef = useRef(false);

  const handlePlay = useCallback(async (station, retryCount = 0) => {
    if (!audioRef.current) return;

    try {
      setPlayerState((prev) => ({
        ...prev,
        isLoading: true,
        currentStation: station,
        error: null,
      }));

      // Reset current audio
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();

      // Wait a bit before setting new source
      await new Promise((resolve) => setTimeout(resolve, 200));

      audioRef.current.src = station.streamUrl;

      // Wait for canplay or error event
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error('Loading timeout'));
        }, 10000);

        const errorHandler = (e) => {
          cleanup();
          reject(new Error(e.target.error?.message || 'Audio loading failed'));
        };

        const canPlayHandler = () => {
          cleanup();
          resolve();
        };

        const cleanup = () => {
          clearTimeout(timeoutId);
          audioRef.current.removeEventListener('canplay', canPlayHandler);
          audioRef.current.removeEventListener('error', errorHandler);
        };

        audioRef.current.addEventListener('canplay', canPlayHandler);
        audioRef.current.addEventListener('error', errorHandler);
      });

      await audioRef.current.play();

      setPlayerState((prev) => ({
        ...prev,
        isPlaying: true,
        currentStation: station,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      // If it's the first error, try once more
      if (retryCount === 0) {
        console.warn('First attempt failed, retrying...');
        return handlePlay(station, retryCount + 1);
      }

      // Ignore AbortError when switching stations quickly
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Playback failed:', error);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }

      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: error.message || 'Failed to play audio',
      }));
    }
  }, []);

  const handlePause = useCallback(() => {
    if (!audioRef.current || playerState.isLoading) return;

    audioRef.current.pause();
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, [playerState.isLoading]);

  const togglePlay = async (audioId) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;

      const station = findStation(audioId, stations);
      const isNewStation =
        playerState.currentStation === null ||
        encodeUrl(playerState.currentStation.streamUrl) !== audioId;

      if (!audioRef.current) return;

      if (isNewStation) {
        await handlePlay(station);
      } else {
        if (playerState.isPlaying) {
          handlePause();
        } else {
          await handlePlay(station);
        }
      }
    } catch (error) {
      console.error('Toggle play error:', error);
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
      }));
    } finally {
      isLoadingRef.current = false;
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
        onError={(e) => {
          // Only handle errors if we're not already loading or retrying
          if (!playerState.isLoading && e.target.error?.code !== 20) {
            console.error('Audio error:', e.target.error);
            // Only attempt recovery if we're supposed to be playing
            if (playerState.isPlaying && playerState.currentStation) {
              handlePlay(playerState.currentStation);
            } else {
              setPlayerState((prev) => ({
                ...prev,
                isPlaying: false,
                isLoading: false,
                error: 'Audio playback error',
              }));
            }
          }
        }}
        onStalled={() => {
          // Only attempt recovery if we're supposed to be playing
          if (
            playerState.isPlaying &&
            playerState.currentStation &&
            !playerState.isLoading
          ) {
            console.warn('Audio stalled, attempting recovery');
            handlePlay(playerState.currentStation);
          }
        }}
        volume={playerState.volume}
        preload="auto"
      />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioPlayerContext);
