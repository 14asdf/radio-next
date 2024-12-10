import { Provider } from '../components/ui/provider';

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
    icon: 'favicon.ico',
    apple: 'apple-touch-icon.png',
  },
  manifest: 'site.webmanifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
