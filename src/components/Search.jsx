'use client';

import { debounce } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { RiSearchLine } from 'react-icons/ri';
import StationSearchRow from '@/components/StationSearchRow';
import { SearchTabs } from '@/components/search/SearchTabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useStations } from '@/contexts/StationsContext';
import { cn } from '@/lib/utils';
import genres from '../../messages/ru.json';

const SearchResults = React.memo(() => {
  const { stations } = useStations();
  const searchParams = useSearchParams();
  const t = useTranslations('search');
  const searchTerm = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || 'all';

  const [visibleItems, setVisibleItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const loadingMoreRef = useRef(false);
  const containerRef = useRef(null);

  const searchTermLower = searchTerm.toLowerCase().trim();
  const genreMap = genres.genres;

  const filteredStations = React.useMemo(() => {
    if (!searchTerm) return [];

    return stations.filter((station) => {
      switch (searchType) {
        case 'name':
          return station.title.toLowerCase().includes(searchTermLower);
        case 'genre':
          return station.tags?.split(',').some((tag) => {
            const trimmedTag = tag.trim();
            return (
              genreMap[trimmedTag]?.toLowerCase().includes(searchTermLower) ||
              trimmedTag.toLowerCase().includes(searchTermLower)
            );
          });
        default:
          return (
            station.title.toLowerCase().includes(searchTermLower) ||
            station.tags?.split(',').some((tag) => {
              const trimmedTag = tag.trim();
              return (
                genreMap[trimmedTag]?.toLowerCase().includes(searchTermLower) ||
                trimmedTag.toLowerCase().includes(searchTermLower)
              );
            })
          );
      }
    });
  }, [stations, searchTermLower, searchType, genreMap]);

  const hasMore = visibleItems < filteredStations.length;

  useEffect(() => {
    setVisibleItems(10);
    loadingMoreRef.current = false;
    setIsLoading(false);
  }, [searchTerm, searchType]);

  const handleLoadMore = useCallback(() => {
    if (loadingMoreRef.current || visibleItems >= filteredStations.length) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoading(true);

    setTimeout(() => {
      setVisibleItems((prev) => (prev < filteredStations.length ? prev + 10 : prev));
      setIsLoading(false);
      loadingMoreRef.current = false;
    }, 100);
  }, [filteredStations.length, visibleItems]);

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
        visibleItems < filteredStations.length
      ) {
        handleLoadMore();
      }
    }, options);

    const loadingTriggerElement = containerRef.current?.querySelector('[data-loading-trigger]');
    if (loadingTriggerElement) {
      observer.observe(loadingTriggerElement);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, filteredStations.length, visibleItems]);

  const emptyMessageClass = 'mt-6 text-center text-lg md:text-[22px] xl:text-[25px]';

  return (
    <div key={searchTerm} ref={containerRef}>
      {!searchTerm ? (
        <p className={emptyMessageClass}>{t('findStations')}</p>
      ) : filteredStations.length === 0 ? (
        <p className={emptyMessageClass}>
          {searchType === 'all'
            ? t('noResults', { term: searchTerm })
            : searchType === 'name'
              ? t('noResultsName', { term: searchTerm })
              : t('noResultsGenre', { term: searchTerm })}
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {filteredStations.slice(0, visibleItems).map((station, index) => (
              <StationSearchRow key={`${station.streamUrl}-${index}`} station={station} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center" data-loading-trigger>
              {isLoading ? (
                <Spinner />
              ) : (
                <Button size="sm" className="rounded-full" onClick={handleLoadMore}>
                  {t('loadMore')}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
});

SearchResults.displayName = 'SearchResults';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const containerRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryTerm = searchParams.get('q') || '';
    const queryType = searchParams.get('type') || 'all';
    setSearchTerm(queryTerm);
    setSearchType(queryType);
  }, [searchParams]);

  const debouncedSearch = useCallback(
    debounce((term, type) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (term) {
        newSearchParams.set('q', term);
      } else {
        newSearchParams.delete('q');
      }

      if (type !== 'all') {
        newSearchParams.set('type', type);
      } else {
        newSearchParams.delete('type');
      }

      router.push(`/search?${newSearchParams.toString()}`);
    }, 300),
    [router, searchParams]
  );

  const handleSearchChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    debouncedSearch(newTerm, searchType);
  };

  const handleTypeChange = (newType) => {
    setSearchType(newType);
    debouncedSearch(searchTerm, newType);
  };

  const t = useTranslations('search');

  return (
    <div className="mx-auto" ref={containerRef}>
      <div className="sticky top-0 z-[1] bg-background pb-5 pt-1">
        <div className="relative flex gap-2">
          <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('placeholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            className={cn(
              'border-0 bg-muted pl-10 shadow-none focus-visible:ring-0',
              searchTerm && 'pr-10'
            )}
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                debouncedSearch('', searchType);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
            >
              <IoCloseOutline />
            </button>
          )}
        </div>

        <SearchTabs value={searchType} onValueChange={handleTypeChange} />
      </div>

      <SearchResults />
    </div>
  );
}
