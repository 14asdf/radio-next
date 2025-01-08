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

export function ColorModeProvider(props) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };
  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? light : dark;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? (
    <PiSunThin size={24} />
  ) : (
    <PiMoonThin size={24} />
  );
}

export const ColorModeButton = ({ ...props }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const t = useTranslations('settings');

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
        <Text>{t('changeTheme')}</Text>
      </Button>
    </>
  );
};
