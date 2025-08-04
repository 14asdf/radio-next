'use client';

import { Box, Text, Button, Separator } from '@chakra-ui/react';
import { useColorMode } from './ui/color-mode';
import { useTranslations } from 'next-intl';
import { IoCloseOutline } from 'react-icons/io5';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from './ui/dialog';
import { PiSunThin, PiMoonThin } from 'react-icons/pi';
import { TbSunMoon } from 'react-icons/tb';

export function ThemeSelector({ isOpen, onOpenChange }) {
  const t = useTranslations('settings');
  const { theme, setColorMode } = useColorMode();

  const themes = [
    { key: 'light', icon: PiSunThin, label: t('lightTheme') },
    { key: 'dark', icon: PiMoonThin, label: t('darkTheme') },
    { key: 'system', icon: TbSunMoon, label: t('systemTheme') },
  ];

  const handleThemeChange = (newTheme) => {
    setColorMode(newTheme);
    onOpenChange({ open: false });
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle _dark={{ color: '#fff' }} fontSize="2xl">
            {t('appearance')}
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
              {themes.map(({ key, icon: Icon, label }) => (
                <Button
                  key={key}
                  size="2xl"
                  variant={theme === key ? 'solid' : 'ghost'}
                  onClick={() => handleThemeChange(key)}
                  width="120px"
                  flexDirection="column"
                  gap={2}
                >
                  <Icon size={24} />
                  <Text fontSize="sm">{label}</Text>
                </Button>
              ))}
            </Box>
          </Box>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
