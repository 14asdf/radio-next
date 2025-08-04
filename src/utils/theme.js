export const THEME_COLORS = {
  light: {
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  dark: {
    themeColor: '#1a1a1a',
    backgroundColor: '#1a1a1a',
  },
  system: {
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
};

export const getThemeColors = (theme) => {
  return THEME_COLORS[theme] || THEME_COLORS.system;
};

export const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const getResolvedTheme = (theme) => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const getServerSystemTheme = (userAgent) => {
  if (!userAgent) return 'light';

  const isDarkMode =
    userAgent.includes('dark') ||
    userAgent.includes('Dark') ||
    userAgent.includes('DARK');

  return isDarkMode ? 'dark' : 'light';
};
