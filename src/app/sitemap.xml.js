import { locales } from '@/utils/alternates';

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://radio-next-sigma.vercel.app';

  // Your existing routes and genres arrays stay the same
  const routes = [
    '', // home page
    '/login',
    '/search',
    // ... rest of your routes
  ];

  const genres = [
    'ambient',
    'classical',
    // ... rest of your genres
  ];

  // Your existing XML generation logic stays the same
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // ... rest of your XML generation code ...

  xml += '\n</urlset>';

  // Only this part changes - return Response directly
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
