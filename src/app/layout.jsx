import { Provider as ChakraProvider } from '../components/ui/provider';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import { StationsProvider } from '../contexts/StationsContext';

// Static viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Updated metadata configuration
export const metadata = {
  title: 'Online Radio',
  description: 'Listen to your favorite radio stations',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="root">
          <StationsProvider>
            <ChakraProvider>
              <AudioPlayerProvider>{children}</AudioPlayerProvider>
            </ChakraProvider>
          </StationsProvider>
        </div>
      </body>
    </html>
  );
}
