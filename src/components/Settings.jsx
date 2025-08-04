'use client';
import {
  Box,
  Text,
  HStack,
  Flex,
  Button,
  Separator,
  Heading,
} from '@chakra-ui/react';
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
import { useRouter } from 'next/navigation';
import { ThemeSelector } from './ThemeSelector';

export default function Settings() {
  const t = useTranslations('settings');
  const { theme } = useColorMode();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const router = useRouter();

  const languages = {
    en: 'English',
    ru: 'Русский',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
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
    router.refresh();
    setIsLanguageOpen(false);
    setCurrentLang(newLocale);
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
    <Box display="flex" flexDirection="column" gap={6} maxW="xl" mx="auto">
      <Heading
        fontSize={{ base: '3xl', md: '4xl' }}
        fontWeight="bold"
        mb="6"
        mt="6"
      >
        {t('title')}
      </Heading>

      <Flex
        as="button"
        onClick={() => setIsThemeOpen(true)}
        py={2}
        justify="space-between"
        align="center"
        borderRadius="md"
        cursor="pointer"
        width="fit-content"
      >
        <HStack spacing={2}>
          <ColorModeIcon />
          <Text fontWeight="bold" ml="3">
            {t('appearance')}
          </Text>
        </HStack>
      </Flex>

      <Flex
        as="button"
        onClick={() => setIsLanguageOpen(true)}
        py={2}
        justify="space-between"
        align="center"
        borderRadius="md"
        cursor="pointer"
        width="fit-content"
      >
        <HStack spacing={2}>
          <PiGlobeHemisphereEastThin size={24} />
          <Text fontWeight="bold" ml="3">
            {languages[currentLang]}
          </Text>
        </HStack>
      </Flex>

      <DialogRoot
        open={isLanguageOpen}
        onOpenChange={(e) => setIsLanguageOpen(e.open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle _dark={{ color: '#fff' }} fontSize="2xl">
              {t('chooseLanguage')}
            </DialogTitle>
            <DialogCloseTrigger>
              <IoCloseOutline />
            </DialogCloseTrigger>
          </DialogHeader>
          <Separator />

          <DialogBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gap={4}
                mt="4"
                width="fit-content"
              >
                {Object.entries(languages).map(([locale, name]) => (
                  <Button
                    key={locale}
                    size="2xl"
                    variant="ghost"
                    onClick={() => handleLocaleChange(locale)}
                    width="120px"
                  >
                    <Text>{name}</Text>
                  </Button>
                ))}
              </Box>
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      <ThemeSelector
        isOpen={isThemeOpen}
        onOpenChange={(e) => setIsThemeOpen(e.open)}
      />
    </Box>
  );
}
