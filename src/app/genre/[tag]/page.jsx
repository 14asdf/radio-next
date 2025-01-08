import { generatePageMetadata } from '@/utils/metadata';
import Genre from '@/components/Genres';

export async function generateMetadata({ params }) {
  const { tag } = await Promise.resolve(params);
  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return generatePageMetadata({
    title: `${formattedTag} Radio Stations`,
    description: `Listen to the best ${formattedTag.toLowerCase()} radio stations. Stream live ${formattedTag.toLowerCase()} music online for free.`,
  });
}

export default function GenrePage() {
  return <Genre />;
}
