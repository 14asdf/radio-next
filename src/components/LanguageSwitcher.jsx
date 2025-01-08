'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, IconButton, Box } from '@chakra-ui/react';
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
    router.push(`${pathname}?${newSearchParams.toString()}`);
    setIsOpen(false);
  };

  const currentLang = searchParams.get('lang') || 'en';

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
          <DialogBody>
            <Box display="flex" gap={4}>
              <Button size="2xl" onClick={() => handleLocaleChange('en')}>
                <Text>English</Text>
              </Button>
              <Button size="2xl" onClick={() => handleLocaleChange('ru')}>
                <Text>Русский</Text>
              </Button>
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
