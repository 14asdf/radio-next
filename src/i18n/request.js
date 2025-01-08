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
  let locale = 'en';

  try {
    const headersList = headers();
    const acceptLanguage = headersList.get('accept-language');

    // console.log('Headers available:', headersList.entries());
    // locale = acceptLanguage?.split(',')[0].split('-')[0] || 'en';
    // console.log('Detected locale:', locale);
  } catch (error) {
    console.error('Error accessing headers:', error);
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
