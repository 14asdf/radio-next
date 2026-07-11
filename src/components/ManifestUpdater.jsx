'use client';

import { useEffect } from 'react';
import { getResolvedTheme } from '@/utils/theme';
import { useColorMode } from './ui/color-mode';

export function ManifestUpdater() {
  const { theme } = useColorMode();

  useEffect(() => {
    const updateManifest = async () => {
      const resolvedTheme = getResolvedTheme(theme);
      const manifestUrl = `/api/manifest?theme=${resolvedTheme}`;

      try {
        const response = await fetch(manifestUrl);
        const manifest = await response.json();

        const manifestElement = document.querySelector('link[rel="manifest"]');
        if (manifestElement) {
          manifestElement.href = manifestUrl;
        } else {
          const link = document.createElement('link');
          link.rel = 'manifest';
          link.href = manifestUrl;
          document.head.appendChild(link);
        }

        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
          themeColorMeta.content = manifest.theme_color;
        } else {
          const meta = document.createElement('meta');
          meta.name = 'theme-color';
          meta.content = manifest.theme_color;
          document.head.appendChild(meta);
        }
      } catch (error) {
        console.error('Failed to update manifest:', error);
      }
    };

    updateManifest();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateManifest();

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return null;
}
