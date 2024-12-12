import { Suspense } from 'react';
import StationSearch from '@/components/StationSearch';

export default function SearchPage() {
  return (
    <Suspense>
      <StationSearch />
    </Suspense>
  );
}
