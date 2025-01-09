import { locales } from '@/utils/alternates';
import { promises as fs } from 'fs';
import path from 'path';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://radio.baron.pw';

  // Define all static routes
  const routes = [
    '', // home page
    '/login',
    '/search',
    '/trends',
    '/profile',
    '/settings',
  ];

  // Define genres (filtered from translation file)
  const genres = [
    'ambient',
    'classical',
    'disco',
    'jazz',
    'blues',
    'dance',
    'chill',
    'groove',
    'classics',
    'funk',
    'chillout',
    'pop',
    'folk',
    'guitar',
    'alternative',
    'eclectic',
    'techno',
    'instrumental',
    'choir',
    'crooner',
    'commercial',
    'gospel',
    'news',
    'afrobeats',
    'relax',
    'electronic',
    'hits',
    'bible',
    'cristiana',
    'christian',
    'reggae',
    'hiphop',
    'music',
    'club',
    'rock',
    'community',
    'sports',
    'oldies',
    'country',
    'variety',
    'commercial',
    'npr',
  ];

  // Transform routes into the required format
  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const genreRoutes = genres.map((genre) => ({
    url: `${baseUrl}/genre/${genre}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // Fetch stations.json from public URL
  const stationsResponse = await fetch(`${baseUrl}/stations.json`);
  const stations = await stationsResponse.json();

  // Add station routes
  const stationRoutes = stations.map((station) => ({
    url: `${baseUrl}/station/${encodeURIComponent(station.streamUrl)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Return all routes
  return [...staticRoutes, ...genreRoutes, ...stationRoutes];
}
