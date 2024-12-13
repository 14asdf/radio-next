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
    showMiniPlayer: false,
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
        showMiniPlayer(audioId);
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

  const showMiniPlayer = (audioId) => {
    setPlayerState((prev) => ({ ...prev, showMiniPlayer: audioId }));
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playerState,
        togglePlay,
        showMiniPlayer,
        audioRef,
        stations,
      }}
    >
      <audio
        ref={audioRef}
        onPlay={() => handlePlay(playerState.currentStation)}
        onPause={handlePause}
        onError={(e) => console.error('Audio playback error:', e)}
      />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioPlayerContext);
