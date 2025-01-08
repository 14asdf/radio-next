'use client';
import { Box, Text, Button } from '@chakra-ui/react';
import { ColorModeButton } from './ui/color-mode';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Settings() {
  const t = useTranslations('settings');

  return (
    <Box display="flex" flexDirection="column" gap={6} maxW="xl" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {t('title')}
      </Text>

      <Box>
        <Text mb={2} fontWeight="semibold">
          {t('appearance')}
        </Text>
        <ColorModeButton size="lg" width="full" borderRadius="full" />
      </Box>

      <Box>
        <Text mb={2} fontWeight="semibold">
          {t('language')}
        </Text>
        <LanguageSwitcher />
      </Box>
    </Box>
  );
}
