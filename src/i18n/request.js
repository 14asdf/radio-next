import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  let locale;

  try {
    const headersList = headers();
    locale = headersList.get('x-next-locale');
  } catch (error) {
    console.error('Error accessing headers:', error);
  }

  // Fallback to default locale if headers are not available
  locale = locale || 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
