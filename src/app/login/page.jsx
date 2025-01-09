import Login from '@/components/Login';
import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();
  const alternates = generateAlternates('/login');

  return generatePageMetadata({
    title: t('metadata.login.title'),
    description: t('metadata.login.description'),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  });
}

export default function LoginPage() {
  return <Login />;
}
