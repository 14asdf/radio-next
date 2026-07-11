import { NextRequest, NextResponse } from 'next/server';
import { getServerSystemTheme, getThemeColors } from '@/utils/theme';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get('theme') || 'system';
  const userAgent = request.headers.get('user-agent') || '';

  let resolvedTheme = theme;
  if (theme === 'system') {
    resolvedTheme = getServerSystemTheme(userAgent);
  }

  const colors = getThemeColors(resolvedTheme);

  const manifest = {
    name: 'Radio Baron',
    short_name: 'Radio Baron',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/favicon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: colors.themeColor,
    background_color: colors.backgroundColor,
    display: 'standalone',
    start_url: '/',
    scope: '/',
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
