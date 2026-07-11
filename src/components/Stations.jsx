'use client';
import { useSearchParams } from 'next/navigation';
import { useStations } from '@/contexts/StationsContext';
import StationInfo from '../components/StationInfo';
import StationSelect from '../components/StationSelect';

const Stations = () => {
  const searchParams = useSearchParams();
  const { isLoading } = useStations();
  const id = searchParams.get('id');
  return id && !isLoading ? <StationInfo audioId={id} /> : <StationSelect />;
};

export default Stations;
