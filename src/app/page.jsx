import { findStation, decodeUrl } from '../utils';
import App from '../components/App';
import './styles.css';
import { join } from 'path';
import { readFile } from 'fs/promises';

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

  console.log('searchParams:', searchParams);
  const audioId = searchParams?.id || null;
  console.log('audioId:', audioId);
  console.log('stations:', stations);

  const audioSrc = audioId ? decodeUrl(audioId) : null;
  console.log('audioSrc:', audioSrc);
  const station = audioSrc ? findStation(audioId, stations) : null;
  console.log('station:', station);

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

export default async function Home(props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  console.log('Home searchParams:', searchParams);
  const initialId = searchParams?.id || null;
  console.log('Home initialId:', initialId);
  return <App initialId={initialId} />;
}
