import { findStation, decodeUrl } from '../utils';
import './styles.css';
import { join } from 'path';
import { readFile } from 'fs/promises';
import RouteHandler from './routes';

export async function generateMetadata(props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  let stations = [];
  try {
    stations = JSON.parse(
      await readFile(join(process.cwd(), 'public', 'stations.json'), 'utf8')
    );
  } catch (error) {
    console.error('Error reading stations.json:', error);
  }

  const audioId = searchParams?.id || null;

  const audioSrc = audioId ? decodeUrl(audioId) : null;
  const station = audioSrc ? findStation(audioId, stations) : null;

  const title = station ? `${station.title} | Radio cloud` : 'Radio cloud';
  const image = station?.img || '/android-chrome-192x192.png';
  const description =
    'Listen to your favorite radio stations live online - free streaming radio';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website',
      siteName: 'Radio cloud',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'telegram-channel:image': image,
      'telegram-channel:title': title,
      'telegram-channel:description': description,
    },
  };
}

export default function HomePage() {
  return <RouteHandler />;
}
