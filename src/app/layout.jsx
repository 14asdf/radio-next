import App from '@/App';
import { Provider as ChakraProvider } from '../components/ui/provider';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import { StationsProvider } from '../contexts/StationsContext';
import { Suspense } from 'react';
import { AuthProvider } from '../contexts/AuthContext';

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

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <div id="root">
            <StationsProvider>
              <ChakraProvider>
                <AudioPlayerProvider>
                  <Suspense>
                    <App>{children}</App>
                  </Suspense>
                </AudioPlayerProvider>
              </ChakraProvider>
            </StationsProvider>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
