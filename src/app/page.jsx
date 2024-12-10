import { findStation, decodeUrl } from '../utils';
import s from '../stations.json';
import HomeClient from './HomeClient';

export async function generateMetadata({ searchParams }) {
  const audioId = searchParams.id;
  const audioSrc = audioId ? decodeUrl(audioId) : null;
  const station = audioSrc ? findStation(audioId, s) : null;

  return {
    title: station ? `${station.title} | Radio Online` : 'Radio Online',
    openGraph: {
      title: station ? `${station.title} | Radio Online` : 'Radio Online',
      images: [station?.img || '/android-chrome-512x512.png'],
    },
    twitter: {
      title: station ? `${station.title} | Radio Online` : 'Radio Online',
      images: [station?.img || '/android-chrome-512x512.png'],
    },
  };
}

export default function Home({ searchParams }) {
  return <HomeClient initialId={searchParams.id} />;
}
