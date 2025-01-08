'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, IconButton, Box, Separator } from '@chakra-ui/react';
import { PiGlobeHemisphereEastThin } from 'react-icons/pi';
import { Text } from '@chakra-ui/react';
import { IoCloseOutline } from 'react-icons/io5';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from './ui/dialog';
import { useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('settings');

  const languages = {
    en: 'English',
    ru: 'Русский',
  };

  const handleLocaleChange = (newLocale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;sameSite=strict`;
    window.location.reload();
    setIsOpen(false);
  };

  // Get current language from cookie
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const localeCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='));
    const locale = localeCookie ? localeCookie.split('=')[1] : 'en';
    setCurrentLang(locale);
  }, []);

  return (
    <>
      <IconButton
        display={{ base: 'flex', xl: 'none' }}
        variant="ghost"
        borderRadius="full"
        aria-label={t('language')}
        onClick={() => setIsOpen(true)}
      >
        <PiGlobeHemisphereEastThin size={24} />
      </IconButton>
      <Button
        variant="ghost"
        display={{ base: 'none', xl: 'flex' }}
        size="lg"
        gap="3"
        justifyContent="flex-start"
        borderRadius="full"
        onClick={() => setIsOpen(true)}
      >
        <PiGlobeHemisphereEastThin size={24} />
        <Text>{languages[currentLang]}</Text>
      </Button>

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
          <Separator />
          <DialogBody>
            <Box display="flex" gap={4} mt="4">
              <Button
                size="2xl"
                variant="ghost"
                onClick={() => handleLocaleChange('en')}
              >
                <Text>English</Text>
              </Button>
              <Button
                size="2xl"
                variant="ghost"
                onClick={() => handleLocaleChange('ru')}
              >
                <Text>Русский</Text>
              </Button>
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
