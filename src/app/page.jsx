import { findStation, decodeUrl } from '../utils';
import s from '../stations.json';
import HomeClient from './HomeClient';

export async function generateMetadata({ searchParams }) {
  const audioId = searchParams.id;
  const audioSrc = audioId ? decodeUrl(audioId) : null;
  const station = audioSrc ? findStation(audioId, s) : null;

  const title = station ? `${station.title} | Online Radio` : 'Online Radio';
  const image =
    station?.img ||
    'https://sun9-67.userapi.com/impg/VMeLVKW007WoGlxbwzFWPTpgqibq6gf_xebhfA/_4cpdXADUbA.jpg?size=500x500&quality=96&sign=50831e64c37110086e0203474f6f643a&type=album';
  const description = station
    ? `Listen to ${station.title} live online - free streaming radio`
    : 'Listen to your favorite radio stations live online - free streaming radio';

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
