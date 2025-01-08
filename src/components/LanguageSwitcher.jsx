'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();

  useEffect(() => {
    // Initialize localStorage with current locale if not set
    if (!localStorage.getItem('NEXT_LOCALE')) {
      localStorage.setItem('NEXT_LOCALE', currentLocale);
    }
  }, [currentLocale]);

  const handleLanguageChange = (newLocale) => {
    // Store the selected language
    localStorage.setItem('NEXT_LOCALE', newLocale);

    // Refresh the page with new locale
    router.refresh();
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      {/* Add more languages as needed */}
    </select>
  );
}
