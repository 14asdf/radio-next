'use client';

import { useTranslations } from 'next-intl';
import { PiMonitorThin, PiMoonThin, PiSunThin } from 'react-icons/pi';
import { useColorMode } from './ui/color-mode';

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
    <div className="flex items-center gap-1 opacity-70">
      {getThemeIcon()}
      <span className="hidden text-xs md:block">{getThemeText()}</span>
    </div>
  );
}
