import Login from '@/components/Login';
import { generatePageMetadata } from '@/utils/metadata';
import { generateAlternates } from '@/utils/alternates';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();

  return generatePageMetadata({
    title: t('metadata.login.title'),
    description: t('metadata.login.description'),
    alternates: generateAlternates('/login'),
  });
}

export default function LoginPage() {
  return <Login />;
}
