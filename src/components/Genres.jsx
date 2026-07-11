'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import StationSearchRow from '@/components/StationSearchRow';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useStations } from '@/contexts/StationsContext';
import { getGenreColor } from '@/utils/colors';

const Genre = () => {
  const params = useParams();
  const router = useRouter();
  const { tag } = params;
  const { stations } = useStations();
  const t = useTranslations('genres');

  const genreStations = useMemo(() => {
    if (!stations || !tag) return [];

    return stations.filter((station) =>
      station.tags
        ?.toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .includes(decodeURIComponent(tag).toLowerCase())
    );
  }, [stations, tag]);

  const bgColor = useMemo(() => getGenreColor(tag), [tag]);

  const handleBack = () => {
    router.push('/');
  };

  const [displayedStations, setDisplayedStations] = useState([]);
  const stationsPerPage = 20;

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);

  const hasMore = displayedStations.length < genreStations.length;

  const handleLoadMore = useCallback(() => {
    if (loadingMoreRef.current || displayedStations.length >= genreStations.length) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    setTimeout(() => {
      setDisplayedStations((prev) => {
        if (prev.length >= genreStations.length) return prev;

        const nextStations = genreStations.slice(prev.length, prev.length + stationsPerPage);

        return nextStations.length > 0 ? [...prev, ...nextStations] : prev;
      });

      setIsLoadingMore(false);
      loadingMoreRef.current = false;
    }, 100);
  }, [genreStations, stationsPerPage]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const lastEntry = entries[0];
      if (
        lastEntry.isIntersecting &&
        !loadingMoreRef.current &&
        displayedStations.length < genreStations.length
      ) {
        handleLoadMore();
      }
    }, options);

    const loadingTriggerElement = containerRef.current?.querySelector('[data-loading-trigger]');
    if (loadingTriggerElement) {
      observer.observe(loadingTriggerElement);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, displayedStations.length, genreStations.length]);

  useEffect(() => {
    loadingMoreRef.current = false;
    setIsLoadingMore(false);
    setDisplayedStations(genreStations.slice(0, stationsPerPage));
  }, [genreStations, stationsPerPage]);

  const translationKey = useMemo(() => {
    const decodedTag = decodeURIComponent(tag || '');
    return decodedTag.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }, [tag]);

  return (
    <div className="min-h-screen w-full rounded-2xl bg-muted dark:bg-neutral-900">
      <div
        className="relative h-[300px] w-full rounded-t-2xl bg-cover bg-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-t-2xl bg-gradient-to-b from-transparent to-background/95 dark:to-neutral-900/95" />

        <div className="relative mx-auto h-full max-w-7xl px-4 md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-10 rounded-full hover:bg-white/20 md:left-8"
            onClick={handleBack}
            aria-label="Go back"
          >
            <IoArrowBackSharp size={24} />
          </Button>

          <div className="absolute bottom-10">
            <h1 className="text-3xl font-bold capitalize md:text-4xl">{t(translationKey)}</h1>
            <p className="mt-2 text-sm font-bold md:text-base">
              {t('stationCount', { count: genreStations.length })}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8" ref={containerRef}>
        {genreStations.length === 0 ? (
          <p className="text-muted-foreground">No stations found for this genre.</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {displayedStations.map((station, index) => (
                <StationSearchRow key={`${station.streamUrl}-${index}`} station={station} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-4 flex justify-center" data-loading-trigger>
                {isLoadingMore ? (
                  <Spinner />
                ) : (
                  <Button onClick={handleLoadMore} size="sm" className="rounded-full">
                    {t('loadMore')}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Genre;
