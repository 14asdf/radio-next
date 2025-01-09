import { locales } from '@/utils/alternates';

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://radio-next-sigma.vercel.app/';

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

  // Create XML content
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Add static routes with language alternatives
  routes.forEach((route) => {
    xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>`;

    locales.forEach((locale) => {
      xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="${locale}" 
      href="${baseUrl}${route}?lang=${locale}"/>`;
    });

    xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${baseUrl}${route}"/>
  </url>`;
  });

  // Add genre routes with language alternatives
  genres.forEach((genre) => {
    xml += `
  <url>
    <loc>${baseUrl}/genre/${genre}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>`;

    locales.forEach((locale) => {
      xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="${locale}" 
      href="${baseUrl}/genre/${genre}?lang=${locale}"/>`;
    });

    xml += `
    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${baseUrl}/genre/${genre}"/>
  </url>`;
  });

  xml += '\n</urlset>';

  // Return XML with proper headers
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
