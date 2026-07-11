'use client';

import { useTranslations } from 'next-intl';
import { PiMoonThin, PiSunThin } from 'react-icons/pi';
import { TbSunMoon } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useColorMode } from './ui/color-mode';

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
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('appearance')}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex items-center justify-center">
          <div className="mt-4 grid w-fit grid-cols-3 gap-4">
            {themes.map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                variant={theme === key ? 'default' : 'ghost'}
                onClick={() => handleThemeChange(key)}
                className={cn('flex h-auto w-[120px] flex-col gap-2 py-4')}
              >
                <Icon size={24} />
                <span className="text-sm">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
