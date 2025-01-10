import { findStation } from '../utils/stations';
import './styles.css';
import { join } from 'path';
import { readFile } from 'fs/promises';
import Stations from '@/components/Stations';
import { generatePageMetadata } from '../utils/metadata';
import { getTranslations } from 'next-intl/server';
import { generateAlternates } from '@/utils/alternates';

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

export async function generateMetadata({ searchParams }) {
  const t = await getTranslations('metadata');
  const params = await Promise.resolve(searchParams);
  const stations = await getStations();
  const audioId = params?.id ?? null;
  const alternates = generateAlternates('/');

  if (audioId) {
    const station = findStation(audioId, stations);
    if (station) {
      return generatePageMetadata({
        title: station.title,
        image: station.img,
        alternates: {
          canonical: alternates.canonical,
          languages: alternates.languages,
        },
      });
    }
  }

  return generatePageMetadata({
    title: t('home.title'),
    description: t('home.description'),
    alternates: generateAlternates('/'),
  });
}

export default function HomePage() {
  return <Stations />;
}
