export const locales = ['en', 'ru', 'es', 'de', 'fr'];

export function generateAlternates(path) {
  const languages = {
    'x-default': path,
  };

  // Generate alternate links for each locale
  locales.forEach((locale) => {
    languages[locale] = `${path}?lang=${locale}`;
  });

  return {
    canonical: path,
    languages,
  };
}
