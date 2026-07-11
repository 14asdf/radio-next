'use client';

import { sampleSize } from 'lodash';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getGenreColor } from '@/utils/colors';
import StationAvatar from './StationAvatar';

const GenreCard = React.memo(({ tag, stations }) => {
  const t = useTranslations('genres');
  const translationKey = tag.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const [maxAvatars, setMaxAvatars] = useState(() => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width >= 1536) return 5;
    if (width >= 768) return 4;
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setMaxAvatars(5);
      else if (width >= 768) setMaxAvatars(4);
      else setMaxAvatars(3);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const randomStations = useMemo(() => sampleSize(stations, maxAvatars), [stations, maxAvatars]);

  const genreColor = useMemo(() => getGenreColor(tag), [tag]);

  return (
    <Link
      href={`/genre/${encodeURIComponent(tag)}`}
      className="group block w-full transition-transform duration-200 hover:-translate-y-0.5"
    >
      <Card
        className={cn(
          'relative aspect-square overflow-hidden border-0 bg-transparent p-6 shadow-md transition-opacity duration-200 group-hover:opacity-100',
          'opacity-90'
        )}
        style={{ backgroundColor: genreColor }}
      >
        <div className="flex h-full flex-col justify-between">
          <h3 className="line-clamp-4 w-full text-xl font-bold capitalize text-white">
            {t(translationKey)}
          </h3>
          <AvatarGroup className="-space-x-3">
            {randomStations.map((station) => (
              <StationAvatar key={station.streamUrl} station={station} />
            ))}
            {stations.length > maxAvatars && (
              <Avatar className="size-10 border-2 border-white/20">
                <AvatarFallback className="bg-black/30 text-xs text-white">
                  +{stations.length - maxAvatars}
                </AvatarFallback>
              </Avatar>
            )}
          </AvatarGroup>
        </div>
      </Card>
    </Link>
  );
});

GenreCard.displayName = 'GenreCard';

export default GenreCard;
