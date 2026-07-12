'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useGenreTranslations } from '../utils/genres';
import { createAvatarUrl, encodeUrl } from '../utils/stations';

const genreChipClass =
  'rounded-full border-transparent bg-[#e4e4e7] text-[#27272a] shadow-none hover:bg-[#e4e4e7] dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800';

const StationSearchRow = React.memo(({ station }) => {
  const [imgSrc, setImgSrc] = useState(createAvatarUrl(station.title));
  const [isLoading, setIsLoading] = useState(true);
  const { togglePlay, playerState } = useAudioPlayer();

  const isPlaying = useMemo(() => {
    return playerState.isPlaying && playerState.currentStation?.streamUrl === station.streamUrl;
  }, [playerState, station.streamUrl]);

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
    togglePlay(encodeUrl(station.streamUrl));
  };

  const translateGenre = useGenreTranslations();

  return (
    <div className="flex w-fit max-w-full gap-4">
      <div className="group relative size-20 shrink-0">
        {isLoading ? (
          <div className="flex size-20 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <img src={imgSrc} alt={station.title} className="size-20 rounded-md object-cover" />
            <button
              type="button"
              aria-label={isPlaying ? `Pause ${station.title}` : `Play ${station.title}`}
              onClick={handlePlayClick}
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md border-0 bg-black/60 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {isPlaying ? (
                <IoPauseOutline className="text-white" size={30} />
              ) : (
                <IoPlayOutline className="text-white" size={30} />
              )}
            </button>
          </>
        )}
      </div>
      <Link href={`/?id=${encodeUrl(station.streamUrl)}`} className="min-w-0">
        <p className="text-lg font-bold">{station.title}</p>
        {station.tags && (
          <div className="mt-2 flex flex-wrap gap-2">
            {station.tags
              .split(',')
              .filter((tag) => tag.trim().length <= 10 && tag.length > 3)
              .slice(0, 3)
              .map((tag) => {
                const trimmedTag = tag.trim();
                const translatedTag = translateGenre(trimmedTag) || trimmedTag;
                return (
                  <Badge key={tag} variant="outline" className={genreChipClass}>
                    {translatedTag}
                  </Badge>
                );
              })}
          </div>
        )}
      </Link>
    </div>
  );
});

StationSearchRow.displayName = 'StationSearchRow';

export default StationSearchRow;
