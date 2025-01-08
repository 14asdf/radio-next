import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

/**
 * Next.js internationalization (i18n) configuration for request-time locale detection.
 * This configuration determines the locale and loads corresponding messages for the application.
 *
 * Currently set to use 'en' as the default locale, but includes commented code for
 * automatic locale detection based on the Accept-Language header.
 *
 * @returns {Object} Configuration object containing:
 *   - locale: The detected or default language code
 *   - messages: Loaded translations for the detected locale
 */
export default getRequestConfig(async () => {
  let locale = 'en'; // Default locale

  try {
    // Get headers asynchronously
    const headersList = await headers();

    // Try to get locale from headers one at a time
    const xLocale = headersList.get('x-locale');
    const xNextLocale = headersList.get('x-next-locale');

    // Use the first available locale value
    locale = xLocale || xNextLocale || 'en';
  } catch (error) {
    console.error('Error accessing headers:', error);
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
