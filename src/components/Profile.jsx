'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LuLogOut, LuMenu } from 'react-icons/lu';
import StationSearchRow from '@/components/StationSearchRow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { useStations } from '@/contexts/StationsContext';
import { useFavorites } from '@/hooks/useFavorites';
import { auth } from '@/utils/firebase';
import { findStation } from '@/utils/stations';

const STATIONS_PER_PAGE = 20;

export default function Profile() {
  const { user, setUser } = useAuth();
  const { stations } = useStations();
  const router = useRouter();
  const { getFavorites } = useFavorites();
  const [favoritesList, setFavoritesList] = useState([]);
  const [displayedFavoriteIds, setDisplayedFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const containerRef = useRef(null);
  const t = useTranslations('profile');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    let cancelled = false;

    const loadFavorites = async () => {
      setIsLoading(true);
      const favorites = (await getFavorites()) || [];
      const favList = Array.isArray(favorites) ? favorites : Object.keys(favorites);

      if (!cancelled) {
        setFavoritesList(favList);
        setIsLoading(false);
      }
    };

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [user, router, getFavorites]);

  const validFavorites = useMemo(() => {
    if (!stations?.length) return [];

    return favoritesList.filter((stationId) => findStation(stationId, stations));
  }, [favoritesList, stations]);

  const hasMore = displayedFavoriteIds.length < validFavorites.length;

  const handleLoadMore = useCallback(() => {
    if (loadingMoreRef.current || displayedFavoriteIds.length >= validFavorites.length) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    setTimeout(() => {
      setDisplayedFavoriteIds((prev) => {
        if (prev.length >= validFavorites.length) return prev;

        const nextIds = validFavorites.slice(prev.length, prev.length + STATIONS_PER_PAGE);

        return nextIds.length > 0 ? [...prev, ...nextIds] : prev;
      });

      setIsLoadingMore(false);
      loadingMoreRef.current = false;
    }, 100);
  }, [displayedFavoriteIds.length, validFavorites]);

  useEffect(() => {
    loadingMoreRef.current = false;
    setIsLoadingMore(false);
    setDisplayedFavoriteIds(validFavorites.slice(0, STATIONS_PER_PAGE));
  }, [validFavorites]);

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
        displayedFavoriteIds.length < validFavorites.length
      ) {
        handleLoadMore();
      }
    }, options);

    const loadingTriggerElement = containerRef.current?.querySelector('[data-loading-trigger]');
    if (loadingTriggerElement) {
      observer.observe(loadingTriggerElement);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, displayedFavoriteIds.length, validFavorites.length]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen w-full rounded-2xl bg-muted dark:bg-neutral-900">
      <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-t-2xl">
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
            backgroundImage: `url(${user?.photoURL})`,
          }}
        />

        <div className="relative z-[1]">
          <Avatar className="size-24">
            <AvatarImage src={user?.photoURL} alt={user?.displayName} />
            <AvatarFallback>{user?.displayName?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 size-6 rounded-full shadow-md"
                aria-label="Profile menu"
              >
                <LuMenu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit min-w-0 rounded-full">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-full">
                <LuLogOut />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h1 className="absolute bottom-10 left-6 z-[1] text-3xl font-bold text-white md:text-4xl">
          {t('favoriteStations')}
        </h1>
      </div>

      <div className="p-6" ref={containerRef}>
        <div className="flex flex-col gap-8">
          {displayedFavoriteIds.map((stationId) => (
            <StationSearchRow key={stationId} station={findStation(stationId, stations)} />
          ))}
          {validFavorites.length === 0 && !isLoading && (
            <p className="text-muted-foreground">{t('noFavorites')}</p>
          )}
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <Spinner />
            </div>
          )}
          {!isLoading && hasMore && (
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
        </div>
      </div>
    </div>
  );
}
