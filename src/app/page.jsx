import { findStation, decodeUrl } from '../utils';
import App from '../components/App';
import './styles.css';
import { join } from 'path';
import { readFile } from 'fs/promises';

export async function generateMetadata({ searchParams }) {
  const stations = JSON.parse(
    await readFile(join(process.cwd(), 'public', 'stations.json'), 'utf8')
  );

  const audioId = searchParams.id;
  const audioSrc = audioId ? decodeUrl(audioId) : null;
  const station = audioSrc ? findStation(audioId, stations) : null;

  const title = station ? `${station.title} | Online Radio` : 'Online Radio';
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
      siteName: 'Online Radio',
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

export default function Home({ searchParams }) {
  return <App initialId={searchParams.id} />;
}
