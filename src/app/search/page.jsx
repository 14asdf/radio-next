import { Suspense } from 'react';
import StationSearch from '@/components/StationSearch';
import HomeClient from '@/components/HomeClient';

export default function SearchPage() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
