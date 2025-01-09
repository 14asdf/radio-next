export default function robots() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://radio-next-sigma.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/user/', '/admin/', '/login', '/profile'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
