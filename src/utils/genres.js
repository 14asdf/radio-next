import { useTranslations } from 'next-intl';

export function useGenreTranslations() {
  const t = useTranslations('genres');

  const translateGenre = (genre) => {
    if (!genre) return '';
    const key = genre.toLowerCase();

    return t.has(key) ? t(key) : genre;
  };

  return translateGenre;
}
