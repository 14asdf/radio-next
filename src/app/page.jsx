import { findStation, decodeUrl } from '../utils';
import './styles.css';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { RouteHandler } from './routes';

let stationsCache = null;

async function getStations() {
  if (stationsCache) return stationsCache;

  try {
    stationsCache = JSON.parse(
      await readFile(join(process.cwd(), 'public', 'stations.json'), 'utf8')
    );
    return stationsCache;
  } catch (error) {
    console.error('Error reading stations.json:', error);
    return [];
  }
}

export async function generateMetadata(props, customTitle = null) {
  const stations = await getStations();
  const searchParams = props?.searchParams;
  const audioId = searchParams?.id || null;

  let title = 'Radio cloud';
  let image = '/android-chrome-192x192.png';

  if (audioId) {
    const station = findStation(audioId, stations);
    if (station) {
      title = `${station.title} | Radio cloud`;
      image = station.img || image;
    }
  } else if (customTitle) {
    title = `${customTitle} | Radio cloud`;
  }

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
