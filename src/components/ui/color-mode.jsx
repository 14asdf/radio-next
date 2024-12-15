'use client';

import { ClientOnly, IconButton, Skeleton, Box, Text } from '@chakra-ui/react';
import { ThemeProvider, useTheme } from 'next-themes';

import * as React from 'react';
import { PiMoonThin, PiSunThin } from 'react-icons/pi';

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

export const ColorModeButton = React.forwardRef(function ColorModeButton(
  props,
  ref
) {
  const { toggleColorMode } = useColorMode();
  return (
    <Box
      onClick={toggleColorMode}
      aria-label="Toggle color mode"
      ref={ref}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      {...props}
    >
      <ColorModeIcon />
      <Text fontSize="xs" mt={0.5}>
        Theme
      </Text>
    </Box>
  );
});
