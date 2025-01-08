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

  const handlePlay = useCallback(
    async (station) => {
      if (!audioRef.current || playerState.isLoading) return;

      // Validate station and streamUrl
      if (!station || !station.streamUrl) {
        console.error('Invalid station or URL:', station);
        setPlayerState((prev) => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
          error: 'Invalid station URL',
        }));
        return;
      }

      try {
        // Set loading state and current station immediately
        setPlayerState((prev) => ({
          ...prev,
          isLoading: true,
          currentStation: station, // Set current station before loading
          error: null,
        }));

        // Reset audio element completely
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();

        // Set new source directly
        console.log('Attempting to play URL:', station.streamUrl);
        audioRef.current.src = station.streamUrl;

        // Create a promise that resolves when audio is ready or errors
        const loadPromise = new Promise((resolve, reject) => {
          const loadTimeout = setTimeout(() => {
            reject(new Error('Audio load timeout'));
          }, 10000);

          const handleCanPlay = () => {
            clearTimeout(loadTimeout);
            resolve();
          };

          const handleError = (error) => {
            clearTimeout(loadTimeout);
            console.error('Audio load error:', error);
            const errorDetails =
              audioRef.current?.error?.message ||
              error.message ||
              'Unknown error';
            reject(new Error(`Failed to load audio: ${errorDetails}`));
          };

          audioRef.current.addEventListener('canplay', handleCanPlay, {
            once: true,
          });
          audioRef.current.addEventListener('error', handleError, {
            once: true,
          });
        });

        await loadPromise;

        try {
          await audioRef.current.play();
        } catch (playError) {
          throw new Error(`Playback failed: ${playError.message}`);
        }

        setPlayerState((prev) => ({
          ...prev,
          isPlaying: true,
          currentStation: station,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        console.error('Playback failed:', error);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current.load();
        }

        setPlayerState((prev) => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
          error: error.message || 'Failed to play audio',
        }));
      }
    },
    [playerState.isLoading]
  );

  const handlePause = useCallback(() => {
    if (!audioRef.current || playerState.isLoading) return;

    audioRef.current.pause();
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, [playerState.isLoading]);

  const togglePlay = async (audioId) => {
    if (playerState.isLoading) return;

    try {
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
        onPlay={() =>
          !playerState.isLoading && handlePlay(playerState.currentStation)
        }
        onPause={() => !playerState.isLoading && handlePause()}
        onError={(e) => {
          console.error('Audio error:', e);
          setPlayerState((prev) => ({
            ...prev,
            isPlaying: false,
            isLoading: false,
            error: 'Audio playback error',
          }));
        }}
        onStalled={() => {
          console.warn('Audio stalled');
          handlePlay(playerState.currentStation);
        }}
        volume={playerState.volume}
        preload="auto"
      />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioPlayerContext);
