'use client';

import React, { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useStations } from '@/contexts/StationsContext';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useGenreTranslations } from '../utils/genres';
import {
  createAvatarUrl,
  decodeUrl,
  encodeUrl,
  findStation,
  generateUUID,
} from '../utils/stations';
import Comments from './Comments';
import Share from './Share';

const StationInfo = ({ audioId }) => {
  const { playerState, togglePlay } = useAudioPlayer();
  const [imgSrc, setImgSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { stations } = useStations();
  const audioSrc = React.useMemo(() => decodeUrl(audioId), [audioId]);
  const station = React.useMemo(
    () => (audioSrc ? findStation(audioId, stations) : null),
    [audioId, audioSrc, stations]
  );
  const { user } = useAuth();
  const { toggleFavorite, getFavorites } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  const translateGenre = useGenreTranslations();

  useEffect(() => {
    setIsLoading(true);
    if (station?.img) {
      const img = new window.Image();
      img.src = station.img;
      img.onerror = () => {
        setImgSrc(createAvatarUrl(station?.title || ''));
        setIsLoading(false);
      };
      img.onload = () => {
        setImgSrc(station.img);
        setIsLoading(false);
      };
    } else {
      setImgSrc(createAvatarUrl(station?.title || ''));
      setIsLoading(false);
    }
  }, [station]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favs = (await getFavorites()) || [];
      const favoritesList = Array.isArray(favs) ? favs : Object.keys(favs);

      if (station?.streamUrl) {
        setIsFavorite(favoritesList.includes(encodeUrl(station.streamUrl)));
      }
    };

    loadFavorites();
  }, [station?.streamUrl, getFavorites]);

  const handleFavoriteClick = async () => {
    if (!user || !station?.streamUrl) return;
    await toggleFavorite(encodeUrl(station.streamUrl));
    setIsFavorite((prev) => !prev);
  };

  const isCurrentlyPlaying =
    playerState.isPlaying &&
    playerState.currentStation &&
    encodeUrl(playerState.currentStation.streamUrl) === audioId;

  if (!station) return null;

  const PlayButton = ({ className }) => (
    <Button
      aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
      onClick={() => togglePlay(audioId)}
      className={cn('size-14 shrink-0 rounded-full md:size-[70px]', className)}
      size="icon"
    >
      {isCurrentlyPlaying ? (
        <IoPauseOutline className="size-6 md:size-8" />
      ) : (
        <IoPlayOutline className="size-6 md:size-8" />
      )}
    </Button>
  );

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-[2em]">
        <svg className="absolute size-0">
          <defs>
            <filter
              id="blur-filter"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="300" edgeMode="none" />
              <fePadding left="50%" right="50%" top="50%" bottom="50%" />
            </filter>
          </defs>
        </svg>

        <div
          className="absolute inset-0 bg-neutral-900 bg-cover bg-no-repeat"
          style={{
            filter: 'url(#blur-filter)',
            backgroundImage: `url(${imgSrc})`,
          }}
        />

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-6 px-4 py-8 md:flex-row md:items-center md:justify-start md:gap-8">
          <div className="z-[1] order-2 w-full md:order-1">
            <div className="mb-4 flex w-full items-start justify-between gap-2 md:justify-start md:gap-6">
              <PlayButton className="m-4 hidden md:flex" />

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex w-full items-center justify-between gap-3 md:justify-start">
                  <h1 className="min-w-0 flex-1 text-xl font-bold md:text-3xl">{station.title}</h1>
                  <PlayButton className="md:hidden" />
                </div>

                <div className="mt-2 flex w-full flex-wrap gap-2">
                  {station.tags
                    ?.split(',')
                    .filter(Boolean)
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length >= 3 && tag.length <= 10)
                    .slice(0, 3)
                    .map((tag) => {
                      const trimmedTag = tag.trim();
                      const translatedTag = translateGenre(trimmedTag) || trimmedTag;
                      return (
                        <Badge
                          key={generateUUID()}
                          className="rounded-full bg-white/20 px-3 py-1 text-sm text-white"
                        >
                          {translatedTag}
                        </Badge>
                      );
                    })}
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    {user && (
                      <Button
                        aria-label="Favorite"
                        onClick={handleFavoriteClick}
                        variant="ghost"
                        size="icon"
                        className={cn('rounded-full', isFavorite && 'text-red-500')}
                      >
                        {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
                      </Button>
                    )}
                    <Share />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[1] order-1 size-[240px] shrink-0 md:order-2 md:size-[320px]">
            {isLoading ? (
              <div className="flex size-full items-center justify-center">
                <Spinner className="size-8 text-white" />
              </div>
            ) : (
              <img src={imgSrc} alt={station.title} className="size-full rounded-lg object-cover" />
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 py-8">
        <Comments stationId={audioId} />
      </div>
    </div>
  );
};

export default React.memo(StationInfo);
