'use client';

import { onValue, ref } from 'firebase/database';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import StationSearchRow from '@/components/StationSearchRow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { useStations } from '@/contexts/StationsContext';
import { db } from '@/utils/firebase';
import { findStation } from '@/utils/stations';

export default function User({ id }) {
  const [userData, setUserData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { stations } = useStations();
  const t = useTranslations('profile');

  useEffect(() => {
    if (!id) return;

    const userRef = ref(db, `users/${id}`);
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData(data);
      }
      setIsLoading(false);
    });

    const favoritesRef = ref(db, `favorites/${id}`);
    const unsubscribeFavorites = onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      const favoritesList = data?.favorites || [];
      setFavorites(favoritesList);
    });

    return () => {
      unsubscribeUser();
      unsubscribeFavorites();
    };
  }, [id]);

  if (!userData || !stations || !stations.length) {
    return null;
  }

  const validFavorites = favorites.filter((stationId) => {
    try {
      return findStation(stationId, stations) !== undefined;
    } catch {
      return false;
    }
  });

  return (
    <div className="min-h-screen w-full rounded-2xl bg-muted dark:bg-neutral-900">
      <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-t-2xl">
        <svg className="absolute size-0">
          <defs>
            <filter
              id="blur-filter-user"
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
            filter: 'url(#blur-filter-user)',
            backgroundImage: `url(${userData?.photoURL})`,
          }}
        />

        <div className="relative z-[1]">
          <Avatar className="size-24">
            <AvatarImage src={userData.photoURL} alt={userData.displayName} />
            <AvatarFallback>{userData.displayName?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>

        <h1 className="absolute bottom-10 left-6 z-[1] text-3xl font-bold text-white md:text-4xl">
          {t('favoriteStations')}
        </h1>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-8">
          {validFavorites.map((stationId) => (
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
        </div>
      </div>
    </div>
  );
}
