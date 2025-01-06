'use client';
import { useSearchParams } from 'next/navigation';
import Player from '../components/Player';
import StationSelect from '../components/StationSelect';
import StationSearch from '../components/StationSearch';
import { useStations } from '@/contexts/StationsContext';

// Custom RouteHandler component
export const RouteHandler = () => {
  const searchParams = useSearchParams();
  const { isLoading } = useStations();
  const id = searchParams.get('id');
  return id && !isLoading ? <Player audioId={id} /> : <StationSelect />;
};
