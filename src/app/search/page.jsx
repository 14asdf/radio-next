import { generatePageMetadata } from '@/utils/metadata';
import Search from '@/components/Search';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Search Radio Stations',
    description:
      'Search and discover thousands of live radio stations from around the world. Find your favorite music, news, sports, and talk radio stations.',
  });
}

export default function SearchPage() {
  return <Search />;
}
