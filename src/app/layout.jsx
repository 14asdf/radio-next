import Main from '@/components/Main';
import { Provider as ChakraProvider } from '../components/ui/provider';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import { StationsProvider } from '../contexts/StationsContext';
import { Suspense } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { NextIntlClientProvider } from 'next-intl';
import { headers } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';
import { ManifestUpdater } from '../components/ManifestUpdater';

// Static viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Updated metadata configuration
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    other: [
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({ children }) {
  const headersList = headers();
  const locale = await getLocale();
  console.log(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <head>
        <meta name="yandex-verification" content="ee7e9085c739e9a7" />
        <meta name="msvalidate.01" content="301D34290CADE681F25EBB82B2E4DBC8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
      </head>
      <body suppressHydrationWarning>
        <div id="root">
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <StationsProvider>
                <ChakraProvider>
                  <AudioPlayerProvider>
                    <ManifestUpdater />
                    <Suspense>
                      <Main>{children}</Main>
                    </Suspense>
                  </AudioPlayerProvider>
                </ChakraProvider>
              </StationsProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
