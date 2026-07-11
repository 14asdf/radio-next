'use client';

import { useTranslations } from 'next-intl';
import { ThemeProvider, useTheme } from 'next-themes';
import { PiMoonThin, PiSunThin } from 'react-icons/pi';
import { TbSunMoon } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ColorModeProvider(props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey="NEXT_THEME"
      disableTransitionOnChange
      enableSystem
      {...props}
    />
  );
}

export function useColorMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleColorMode = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const setColorMode = (newTheme) => {
    setTheme(newTheme);
  };

  return {
    colorMode: resolvedTheme,
    theme: theme,
    setColorMode,
    toggleColorMode,
  };
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? light : dark;
}

export function ColorModeIcon() {
  const { theme } = useColorMode();

  switch (theme) {
    case 'light':
      return <PiSunThin size={24} />;
    case 'dark':
      return <PiMoonThin size={24} />;
    case 'system':
    default:
      return <TbSunMoon size={24} />;
  }
}

export const ColorModeButton = ({ className, ...props }) => {
  const { theme, toggleColorMode } = useColorMode();
  const t = useTranslations('settings');

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
    <>
      <Button
        onClick={toggleColorMode}
        variant="ghost"
        size="icon"
        className={cn('rounded-full xl:hidden', className)}
        {...props}
      >
        <ColorModeIcon />
      </Button>
      <Button
        onClick={toggleColorMode}
        variant="ghost"
        size="lg"
        className={cn('hidden w-fit justify-start gap-3 rounded-full xl:flex', className)}
        {...props}
      >
        <ColorModeIcon />
        <span className="text-base font-bold">{getThemeText()}</span>
      </Button>
    </>
  );
};
