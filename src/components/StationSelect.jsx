'use client';

import React, { useMemo } from 'react';
import { useStations } from '@/contexts/StationsContext';
import GenreCard from './home/GenreCard';

const StationSelect = () => {
  const { stations } = useStations();

  const groupedStations = useMemo(() => {
    const groups = new Map();
    const usedStations = new Set();

    stations.forEach((station) => {
      if (!station.tags) return;

      if (!usedStations.has(station.streamUrl)) {
        const tags = station.tags.split(',').map((tag) => tag.trim());
        if (tags.length > 0) {
          const firstTag = tags[0];
          if (!groups.has(firstTag)) {
            groups.set(firstTag, []);
          }
          groups.get(firstTag).push(station);
          usedStations.add(station.streamUrl);
        }
      }
    });

    return Array.from(groups.entries())
      .map(([tag, tagStations]) => ({
        tag,
        stations: tagStations,
      }))
      .filter((group) => group.stations.length >= 5);
  }, [stations]);

  return (
    <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 2xl:grid-cols-5">
      {groupedStations.map(({ tag, stations: tagStations }) => (
        <GenreCard key={tag} tag={tag} stations={tagStations} />
      ))}
    </div>
  );
};

export default StationSelect;
