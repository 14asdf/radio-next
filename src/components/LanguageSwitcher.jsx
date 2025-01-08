'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLocaleChange = (newLocale) => {
    // Create new URLSearchParams object to modify
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('lang', newLocale);

    // Navigate to the same path but with new locale
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleLocaleChange('en')}
        className="px-2 py-1 rounded hover:bg-gray-100"
      >
        EN
      </button>
      <button
        onClick={() => handleLocaleChange('ru')}
        className="px-2 py-1 rounded hover:bg-gray-100"
      >
        RU
      </button>
    </div>
  );
}
