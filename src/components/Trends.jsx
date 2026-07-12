'use client';

import { get, ref } from 'firebase/database';
import { sampleSize } from 'lodash';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import AnimatedBackground from '@/components/AnimatedBackground';
import StationSearchRow from '@/components/StationSearchRow';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { useStations } from '@/contexts/StationsContext';
import { db } from '@/utils/firebase';
import { encodeUrl } from '@/utils/stations';

const trendChipClass =
  'flex cursor-pointer items-center rounded-full border-transparent bg-[#f4f4f5] px-3 py-1 font-bold text-[#27272a] shadow-none hover:bg-[#e4e4e7] dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700';

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      const path =
        event.composedPath?.() ||
        event.path ||
        (event.target.ownerDocument || document).elementsFromPoint(event.clientX, event.clientY);

      const isMenuElement = path.some((element) => {
        const role = element.getAttribute?.('role');
        return role === 'button' || role === 'menu';
      });

      if (isMenuElement) return;
      if (!ref.current || ref.current.contains(event.target)) return;

      setTimeout(() => handler(), 0);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function Trends() {
  const t = useTranslations('trends');
  const [trendingStations, setTrendingStations] = useState([]);
  const [displayedStations, setDisplayedStations] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const [usersData, setUsersData] = useState({});
  const { stations } = useStations();
  const stationsPerPage = 20;
  const containerRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const likesMenuRef = useRef(null);
  const commentsMenuRef = useRef(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const hasMore = displayedStations.length < trendingStations.length;

  useClickOutside(likesMenuRef, () => setActiveMenu(null));
  useClickOutside(commentsMenuRef, () => setActiveMenu(null));

  useEffect(() => {
    const fetchTrendingStations = async () => {
      setIsInitialLoading(true);
      try {
        const favoritesRef = ref(db, 'favorites');
        const favoritesSnapshot = await get(favoritesRef);
        const favoritesData = favoritesSnapshot.val() || {};

        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);
        const usersDataLocal = usersSnapshot.val() || {};
        setUsersData(usersDataLocal);

        const commentsRef = ref(db, 'comments');
        const commentsSnapshot = await get(commentsRef);
        const commentsData = commentsSnapshot.val() || {};

        const stationCounts = new Map();
        const usersByStation = new Map();
        const commentsByStation = new Map();
        const commentCountByStation = new Map();

        Object.entries(favoritesData).forEach(([userId, userData]) => {
          const favorites = userData.favorites || [];
          favorites.forEach((stationId) => {
            if (!usersByStation.has(stationId)) {
              usersByStation.set(stationId, new Set());
            }
            usersByStation.get(stationId).add(userId);
          });
        });

        usersByStation.forEach((userSet, stationId) => {
          stationCounts.set(stationId, userSet.size);
        });

        Object.entries(commentsData).forEach(([stationId, stationData]) => {
          const { commentCount, ...comments } = stationData;
          const commentsList = Object.entries(comments || {})
            .filter(([key]) => key !== 'commentCount')
            .map(([key, value]) => ({
              ...value,
              key,
            }));
          commentsByStation.set(stationId, commentsList);
          commentCountByStation.set(stationId, commentCount || 0);

          if (!stationCounts.has(stationId)) {
            stationCounts.set(stationId, 0);
          }
        });

        const stationsMap = stations.reduce((acc, station) => {
          const encodedUrl = encodeUrl(station.streamUrl);
          acc[encodedUrl] = station;
          return acc;
        }, {});

        const trendingStationIds = Array.from(stationCounts.keys()).sort((a, b) => {
          const likesA = stationCounts.get(a) || 0;
          const likesB = stationCounts.get(b) || 0;
          const commentsA = commentCountByStation.get(a) || 0;
          const commentsB = commentCountByStation.get(b) || 0;
          return likesB + commentsB - (likesA + commentsA);
        });

        const filteredStations = trendingStationIds
          .filter((id) => stationsMap[id])
          .map((id) => ({
            id,
            ...stationsMap[id],
            users: Array.from(usersByStation.get(id) || new Set()).map((userId) => ({
              userId,
              userPhotoURL: usersDataLocal[userId]?.photoURL || null,
              displayName: usersDataLocal[userId]?.name || `User ${userId.slice(0, 4)}`,
            })),
            favoriteCount: stationCounts.get(id) || 0,
            commentCount: commentCountByStation.get(id) || 0,
            comments: commentsByStation.get(id) || [],
          }));

        setTrendingStations(filteredStations);
      } catch (error) {
        console.error('Error fetching trending stations:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchTrendingStations();
  }, [stations]);

  const handleLoadMore = useCallback(() => {
    if (loadingMoreRef.current || displayedStations.length >= trendingStations.length) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    setTimeout(() => {
      setDisplayedStations((prev) => {
        if (prev.length >= trendingStations.length) return prev;

        const nextStations = trendingStations.slice(prev.length, prev.length + stationsPerPage);

        return nextStations.length > 0 ? [...prev, ...nextStations] : prev;
      });

      setIsLoadingMore(false);
      loadingMoreRef.current = false;
    }, 100);
  }, [trendingStations, stationsPerPage]);

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
        displayedStations.length < trendingStations.length
      ) {
        handleLoadMore();
      }
    }, options);

    const loadingTriggerElement = containerRef.current?.querySelector('[data-loading-trigger]');
    if (loadingTriggerElement) {
      observer.observe(loadingTriggerElement);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, displayedStations.length, trendingStations.length]);

  useEffect(() => {
    loadingMoreRef.current = false;
    setIsLoadingMore(false);
    setDisplayedStations(trendingStations.slice(0, stationsPerPage));
  }, [trendingStations, stationsPerPage]);

  const sampledUsersMap = useMemo(() => {
    const maxAvatars = 5;
    return displayedStations.reduce((acc, station) => {
      acc[`likes-${station.id}`] = sampleSize(station.users || [], maxAvatars);

      acc[`comments-${station.id}`] = Array.from(
        new Set(
          (station.comments || [])
            .filter((comment) => comment.userId)
            .map((comment) => comment.userId)
        )
      )
        .slice(0, maxAvatars)
        .map((userId) => ({
          userId,
          userPhotoURL: usersData[userId]?.photoURL,
          displayName: usersData[userId]?.name || 'Anonymous',
        }));

      return acc;
    }, {});
  }, [displayedStations, usersData]);

  const renderAvatarStack = useCallback(
    (menuId) => {
      const maxAvatars = 5;
      const users = sampledUsersMap[menuId] || [];

      return (
        <div className="p-2">
          <AvatarGroup max={maxAvatars}>
            {users.map((user) => (
              <Link key={user.userId} href={`/user/${user.userId}`}>
                <Avatar className="size-8 cursor-pointer">
                  <AvatarImage src={user.userPhotoURL} alt={user.displayName} />
                  <AvatarFallback>{user.displayName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </Link>
            ))}
          </AvatarGroup>
        </div>
      );
    },
    [sampledUsersMap]
  );

  const handleMenuOpen = (menuId) => {
    if (activeMenu === menuId) {
      setTimeout(() => setActiveMenu(null), 100);
    } else {
      setActiveMenu(menuId);
    }
  };

  return (
    <div className="min-h-screen w-full rounded-2xl bg-muted dark:bg-neutral-900">
      <div className="relative h-[300px] w-full rounded-t-2xl bg-muted bg-cover bg-center dark:bg-neutral-900">
        <AnimatedBackground />
        <div className="pointer-events-none absolute inset-0 rounded-t-2xl bg-gradient-to-b from-transparent to-background/95 dark:to-neutral-900/95" />

        <div className="relative mx-auto h-full max-w-7xl px-4 md:px-8">
          <h1 className="absolute bottom-10 text-3xl font-bold md:text-4xl">{t('title')}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8" ref={containerRef}>
        {isInitialLoading ? (
          <div className="mt-4 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            {displayedStations.map((station) => (
              <div key={station.id} className="overflow-hidden py-4 transition-all">
                <StationSearchRow station={station} />
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    {station.favoriteCount > 0 && (
                      <Popover
                        open={activeMenu === `likes-${station.id}`}
                        onOpenChange={(open) => {
                          if (!open) setActiveMenu(null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Badge
                            ref={likesMenuRef}
                            variant="outline"
                            className={trendChipClass}
                            onClick={() => handleMenuOpen(`likes-${station.id}`)}
                          >
                            <AiOutlineHeart size={16} className="mr-1.5" />
                            {station.favoriteCount}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit min-w-0 rounded-xl p-0">
                          {renderAvatarStack(`likes-${station.id}`)}
                        </PopoverContent>
                      </Popover>
                    )}

                    {station.commentCount > 0 && (
                      <Popover
                        open={activeMenu === `comments-${station.id}`}
                        onOpenChange={(open) => {
                          if (!open) setActiveMenu(null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Badge
                            ref={commentsMenuRef}
                            variant="outline"
                            className={trendChipClass}
                            onClick={() => handleMenuOpen(`comments-${station.id}`)}
                          >
                            <AiOutlineComment size={16} className="mr-1.5" />
                            {station.commentCount}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit min-w-0 rounded-xl p-0">
                          {renderAvatarStack(`comments-${station.id}`)}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!isInitialLoading && hasMore && (
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
}
