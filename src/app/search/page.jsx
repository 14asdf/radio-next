import { generatePageMetadata } from '@/utils/metadata';
import Search from '@/components/Search';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'metadata.search.title',
    description: 'metadata.search.description',
  });
}

export default function SearchPage() {
  return <Search />;
}
