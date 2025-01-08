import { generatePageMetadata } from '@/utils/metadata';
import Trends from '@/components/Trends';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Trending Radio Stations',
    description:
      'Discover the most popular and trending radio stations right now. Listen to what others are enjoying - from hit music to breaking news and live sports broadcasts.',
  });
}

export default function SearchPage() {
  return <Trends />;
}
