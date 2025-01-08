import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    messages,
    locale: locale,
    timeZone: 'system',
  };
});
