import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

// Export the combined middleware
export default async function middleware(request) {
  console.log('Middleware running');
  console.log('Request URL:', request.url);

  // Get the locale from search params
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  console.log('Selected language:', lang);

  const newResponse = NextResponse.next({
    request: {
      headers: new Headers({
        'x-next-intl-locale': lang,
        ...Object.fromEntries(request.headers),
      }),
    },
  });

  return newResponse;
}

// Update matcher to catch more routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
