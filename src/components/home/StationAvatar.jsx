'use client';

import React, { useMemo } from 'react';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { cn } from '@/lib/utils';
import { createAvatarUrl, encodeUrl } from '@/utils/stations';

const StationAvatar = React.memo(({ station, className }) => {
  const { playerState, togglePlay } = useAudioPlayer();

  const isPlaying = useMemo(() => {
    return playerState.isPlaying && playerState.currentStation?.streamUrl === station.streamUrl;
  }, [playerState, station.streamUrl]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePlay(encodeUrl(station.streamUrl));
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: play control sits inside genre card link
    <div
      role="button"
      tabIndex={0}
      className={cn('group/avatar relative cursor-pointer', className)}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      <Avatar className="size-10 transition-transform group-hover/avatar:scale-110">
        <AvatarImage src={station.img || createAvatarUrl(station.title)} alt={station.title} />
        <AvatarFallback>{station.title?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover/avatar:opacity-100">
        {isPlaying ? (
          <IoPauseOutline className="text-white" size={20} />
        ) : (
          <IoPlayOutline className="text-white" size={20} />
        )}
      </div>
    </div>
  );
});

StationAvatar.displayName = 'StationAvatar';

export default StationAvatar;
