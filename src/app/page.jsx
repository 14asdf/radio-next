import { findStation, decodeUrl } from '../utils';
import s from '../stations.json';
import HomeClient from './HomeClient';

export async function generateMetadata({ searchParams }) {
  const audioId = searchParams.id;
  const audioSrc = audioId ? decodeUrl(audioId) : null;
  const station = audioSrc ? findStation(audioId, s) : null;

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
  return <HomeClient initialId={searchParams.id} />;
}
