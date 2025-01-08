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

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const languages = {
    en: 'English',
    ru: 'Русский',
  };

  const handleLocaleChange = (newLocale) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('lang', newLocale);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    window.location.href = newUrl;
    setIsOpen(false);
  };

  const currentLang = searchParams.get('lang') || 'en';

  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (!link || link.getAttribute('href').startsWith('http')) return;

      e.preventDefault();
      const href = link.getAttribute('href');
      const currentLang = searchParams.get('lang');

      if (currentLang) {
        // Parse the new URL's search params
        const [path, search] = href.split('?');
        const newSearchParams = new URLSearchParams(search || '');
        newSearchParams.set('lang', currentLang);

        const newUrl = `${path}?${newSearchParams.toString()}`;
        router.push(newUrl);
      } else {
        router.push(href);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router, searchParams]);

  return (
    <>
      <Button
        variant="ghost"
        display={{ base: 'none', xl: 'flex' }}
        size="lg"
        width="full"
        gap="3"
        justifyContent="flex-start"
        borderRadius="full"
        onClick={() => setIsOpen(true)}
      >
        <PiGlobeHemisphereEastThin />
        <Text>{languages[currentLang]}</Text>
      </Button>

      <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle _dark={{ color: '#fff' }} fontSize="2xl">
              Choose Language
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
