import { useTranslations } from 'next-intl';

export function useGenreTranslations() {
  const t = useTranslations('genres');

  const translateGenre = (genre) => {
    if (!genre) return '';
    const key = genre.toLowerCase();

    try {
      return t.raw(key) ? t(key) : genre;
    } catch (error) {
      return genre;
    }
  };

  return translateGenre;
}
