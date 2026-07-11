'use client';

import { debounce } from 'lodash';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import {
  IoPauseOutline,
  IoPlayOutline,
  IoPlaySkipForwardOutline,
  IoVolumeHighOutline,
  IoVolumeLowOutline,
  IoVolumeMediumOutline,
  IoVolumeMuteOutline,
} from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Spinner } from '@/components/ui/spinner';
import { useStations } from '@/contexts/StationsContext';
import { createAvatarUrl, decodeUrl, encodeUrl, findStation } from '@/utils/stations';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const VolumeIcon = ({ volume }) => {
  if (volume === 0) return <IoVolumeMuteOutline />;
  if (volume < 0.33) return <IoVolumeLowOutline />;
  if (volume < 0.66) return <IoVolumeMediumOutline />;
  return <IoVolumeHighOutline />;
};

const MiniPlayer = ({ audioId }) => {
  const { playerState, togglePlay, handleVolumeChange } = useAudioPlayer();
  const [imgSrc, setImgSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const { stations } = useStations();

  const audioSrc = React.useMemo(() => decodeUrl(audioId), [audioId]);
  const station = React.useMemo(
    () => (audioSrc ? findStation(audioId, stations) : null),
    [audioId, audioSrc, stations]
  );

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
    } else if (station) {
      setImgSrc(createAvatarUrl(station.title));
      setIsLoading(false);
    }
  }, [station]);

  const debouncedSetVolume = useCallback(
    debounce((value) => {
      handleVolumeChange(value / 100);
    }, 50),
    [handleVolumeChange]
  );

  const handleNextTrack = () => {
    const currentIndex = stations.findIndex((s) => s.streamUrl === audioSrc);
    const nextIndex = currentIndex === stations.length - 1 ? 0 : currentIndex + 1;
    const nextStation = stations[nextIndex];
    togglePlay(encodeUrl(nextStation.streamUrl), true);
  };

  if (!station) return null;

  return (
    <div className="bg-gray-100 pr-2 dark:bg-zinc-700">
      <div className="grid grid-cols-[60px_minmax(0,1fr)_auto] items-center gap-3">
        {isLoading ? (
          <div className="flex size-[60px] items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Link href={`/?id=${encodeUrl(station.streamUrl)}`}>
            <img src={imgSrc} alt={station.title} className="size-[60px] object-cover" />
          </Link>
        )}

        <div className="overflow-hidden">
          <p className="truncate text-sm font-medium">
            <Link href={`/?id=${encodeUrl(station.streamUrl)}`} className="hover:underline">
              {station.title}
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Popover open={isVolumeOpen} onOpenChange={setIsVolumeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="size-8 rounded-full"
                aria-label="Volume"
              >
                <VolumeIcon volume={playerState.volume} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="h-[180px] w-[50px] p-3">
              <div className="flex h-full items-center justify-center">
                <Slider
                  className="h-[150px] w-[25px]"
                  defaultValue={[playerState.volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  orientation="vertical"
                  onValueChange={(value) => debouncedSetVolume(value[0])}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="secondary"
            size="icon"
            className="size-8 rounded-full"
            aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
            onClick={() => togglePlay(audioId)}
          >
            {playerState.isLoading ? (
              <Spinner />
            ) : playerState.isPlaying ? (
              <IoPauseOutline />
            ) : (
              <IoPlayOutline />
            )}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="size-8 rounded-full"
            aria-label="Next station"
            onClick={handleNextTrack}
          >
            <IoPlaySkipForwardOutline />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MiniPlayer);
