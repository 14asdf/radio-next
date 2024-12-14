import { Suspense } from 'react';
import App from '@/components/App';

export default function SearchPage() {
  return (
    <Suspense>
      <App />
    </Suspense>
  );
}
