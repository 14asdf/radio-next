'use client';
import { useSearchParams } from 'next/navigation';
import StationInfo from '../components/StationInfo';
import StationSelect from '../components/StationSelect';
import { useStations } from '@/contexts/StationsContext';

const Stations = () => {
  const searchParams = useSearchParams();
  const { isLoading } = useStations();
  const id = searchParams.get('id');
  return id && !isLoading ? <StationInfo audioId={id} /> : <StationSelect />;
};

export default Stations;
