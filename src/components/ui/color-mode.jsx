'use client';

import {
  ClientOnly,
  IconButton,
  Skeleton,
  Box,
  Text,
  Button,
} from '@chakra-ui/react';
import { ThemeProvider, useTheme } from 'next-themes';
import * as React from 'react';
import { PiMoonThin, PiSunThin } from 'react-icons/pi';
import { useTranslations } from 'next-intl';
import { getResolvedTheme } from '@/utils/theme';
import { TbSunMoon } from 'react-icons/tb';

export function ColorModeProvider(props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey="NEXT_THEME"
      disableTransitionOnChange
      {...props}
    />
  );
}

export function useColorMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleColorMode = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const setColorMode = (newTheme) => {
    setTheme(newTheme);
  };

  return {
    colorMode: resolvedTheme,
    theme: theme,
    setColorMode,
    toggleColorMode,
  };
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? light : dark;
}

export function ColorModeIcon() {
  const { theme } = useColorMode();

  switch (theme) {
    case 'light':
      return <PiSunThin size={24} />;
    case 'dark':
      return <PiMoonThin size={24} />;
    case 'system':
    default:
      return <TbSunMoon size={24} />;
  }
}

export const ColorModeButton = ({ ...props }) => {
  const { theme, toggleColorMode } = useColorMode();
  const t = useTranslations('settings');

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return t('lightTheme');
      case 'dark':
        return t('darkTheme');
      case 'system':
      default:
        return t('systemTheme');
    }
  };

  return (
    <>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        display={{ base: 'flex', xl: 'none' }}
        {...props}
      >
        <ColorModeIcon />
      </IconButton>
      <Button
        onClick={toggleColorMode}
        variant="ghost"
        display={{ base: 'none', xl: 'flex' }}
        gap="3"
        justifyContent="flex-start"
        {...props}
      >
        <ColorModeIcon />
        <Text fontSize="16px">{getThemeText()}</Text>
      </Button>
    </>
  );
};
