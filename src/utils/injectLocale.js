'use client';

export function injectStoredLocale() {
  if (typeof window !== 'undefined') {
    const storedLocale = localStorage.getItem('NEXT_LOCALE');
    if (!storedLocale) {
      // Initialize with default locale if not set
      localStorage.setItem('NEXT_LOCALE', 'en');
    }

    // Add locale to all subsequent fetch requests
    const originalFetch = window.fetch;
    window.fetch = function (url, options = {}) {
      options.headers = {
        ...options.headers,
        'x-locale': localStorage.getItem('NEXT_LOCALE') || 'en',
      };
      return originalFetch(url, options);
    };
  }
}
