import Main from '@/components/Main';
import { Provider as ChakraProvider } from '../components/ui/provider';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import { StationsProvider } from '../contexts/StationsContext';
import { Suspense } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { NextIntlClientProvider } from 'next-intl';
import { headers } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';

// Static viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Updated metadata configuration
export const metadata = {
  title: 'Radio cloud',
  description: 'Listen to your favorite radio stations',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
      <body suppressHydrationWarning>
        <div id="root">
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <StationsProvider>
                <ChakraProvider>
                  <AudioPlayerProvider>
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
