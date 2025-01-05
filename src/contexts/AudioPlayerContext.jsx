'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from 'react';
import { findStation, decodeUrl } from '../utils';
import _ from 'lodash';
import s from '../stations.json';

const stations = _.uniqBy(s, 'title');

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    currentStation: null,
    stationInMiniPlayer: null,
    volume: 1,
  });

  const audioRef = useRef(null);

  const handlePlay = useCallback((station) => {
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

  const handlePause = () => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  };

  const togglePlay = (audioId, forceAction) => {
    const audioSrc = decodeUrl(audioId);
    const station = findStation(audioId, stations);

    if (forceAction) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = audioSrc;
        audioRef.current.play();
        handlePlay(station);
        stationInMiniPlayer(audioId);
      }
    } else {
      if (audioRef.current) {
        if (playerState.isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.src = audioSrc;
          audioRef.current.play();
        }
      }
    }
  };

  const stationInMiniPlayer = (audioId) => {
    setPlayerState((prev) => {
      if (prev.stationInMiniPlayer && prev.stationInMiniPlayer !== audioId) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const station = findStation(audioId, stations);
        togglePlay(audioId, true);
      }

      return { ...prev, stationInMiniPlayer: audioId };
    });
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
        stationInMiniPlayer,
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
