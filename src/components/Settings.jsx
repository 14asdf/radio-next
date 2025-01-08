'use client';
import { Box, Text, HStack, Flex, Button } from '@chakra-ui/react';
import { ColorModeIcon } from './ui/color-mode';
import { PiGlobeHemisphereEastThin } from 'react-icons/pi';
import { useColorMode } from './ui/color-mode';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from './ui/dialog';

export default function Settings() {
  const t = useTranslations('settings');
  const { toggleColorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const languages = {
    en: 'English',
    ru: 'Русский',
    de: 'Deutsch',
    es: 'Español',
  };

  useEffect(() => {
    const localeCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='));
    const locale = localeCookie ? localeCookie.split('=')[1] : 'en';
    setCurrentLang(locale);
  }, []);

  const handleLocaleChange = (newLocale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;sameSite=strict`;
    window.location.reload();
    setIsOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={6} maxW="xl" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {t('title')}
      </Text>

      <Flex
        as="button"
        onClick={toggleColorMode}
        py={2}
        px={4}
        justify="space-between"
        align="center"
        width="100%"
        borderRadius="md"
        cursor="pointer"
      >
        <HStack spacing={2}>
          <ColorModeIcon />
          <Text fontWeight="bold">{t('appearance')}</Text>
        </HStack>
      </Flex>

      <Flex
        as="button"
        onClick={() => setIsOpen(true)}
        py={2}
        px={4}
        justify="space-between"
        align="center"
        width="100%"
        borderRadius="md"
        cursor="pointer"
      >
        <HStack spacing={2}>
          <PiGlobeHemisphereEastThin size={24} />
          <Text fontWeight="bold">{t('language')}</Text>
        </HStack>
        <Text>{languages[currentLang]}</Text>
      </Flex>

      <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle _dark={{ color: '#fff' }} fontSize="2xl">
              {t('chooseLanguage')}
            </DialogTitle>
            <DialogCloseTrigger>
              <IoCloseOutline />
            </DialogCloseTrigger>
          </DialogHeader>
          <DialogBody>
            <Box display="flex" gap={4} mt="4">
              {Object.entries(languages).map(([locale, name]) => (
                <Button
                  key={locale}
                  size="2xl"
                  variant="ghost"
                  onClick={() => handleLocaleChange(locale)}
                >
                  <Text>{name}</Text>
                </Button>
              ))}
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
