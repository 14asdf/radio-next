'use client';

import { Box, Text, HStack } from '@chakra-ui/react';
import { useColorMode } from './ui/color-mode';
import { useTranslations } from 'next-intl';
import { PiSunThin, PiMoonThin, PiMonitorThin } from 'react-icons/pi';

export function ThemeIndicator() {
  const { theme } = useColorMode();
  const t = useTranslations('settings');

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <PiSunThin size={16} />;
      case 'dark':
        return <PiMoonThin size={16} />;
      case 'system':
      default:
        return <PiMonitorThin size={16} />;
    }
  };

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
    <HStack spacing={1} opacity={0.7}>
      {getThemeIcon()}
      <Text fontSize="xs" display={{ base: 'none', md: 'block' }}>
        {getThemeText()}
      </Text>
    </HStack>
  );
}
