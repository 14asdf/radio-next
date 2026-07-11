'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { PiGlobeHemisphereEastThin } from 'react-icons/pi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ThemeSelector } from './ThemeSelector';
import { ColorModeIcon } from './ui/color-mode';

export default function Settings() {
  const t = useTranslations('settings');
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
    const localeCookie = document.cookie.split('; ').find((row) => row.startsWith('NEXT_LOCALE='));
    const locale = localeCookie ? localeCookie.split('=')[1] : 'en';
    setCurrentLang(locale);
  }, []);

  const handleLocaleChange = (newLocale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;sameSite=strict`;
    router.refresh();
    setIsLanguageOpen(false);
    setCurrentLang(newLocale);
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="mb-6 mt-6 text-3xl font-bold md:text-4xl">{t('title')}</h1>

      <button
        type="button"
        onClick={() => setIsThemeOpen(true)}
        className="flex w-fit cursor-pointer items-center gap-2 rounded-md py-2"
      >
        <ColorModeIcon />
        <span className="ml-3 font-bold">{t('appearance')}</span>
      </button>

      <button
        type="button"
        onClick={() => setIsLanguageOpen(true)}
        className="flex w-fit cursor-pointer items-center gap-2 rounded-md py-2"
      >
        <PiGlobeHemisphereEastThin size={24} />
        <span className="ml-3 font-bold">{languages[currentLang]}</span>
      </button>

      <Dialog open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('chooseLanguage')}</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="flex items-center justify-center">
            <div className="mt-4 grid w-fit grid-cols-3 gap-4">
              {Object.entries(languages).map(([locale, name]) => (
                <Button
                  key={locale}
                  variant="ghost"
                  onClick={() => handleLocaleChange(locale)}
                  className="w-[120px]"
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ThemeSelector isOpen={isThemeOpen} onOpenChange={setIsThemeOpen} />
    </div>
  );
}
