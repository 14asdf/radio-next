import Login from '@/components/Login';
import { generatePageMetadata } from '@/utils/metadata';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();

  return generatePageMetadata({
    title: t('metadata.login.title'),
    description: t('metadata.login.description'),
  });
}

export default function LoginPage() {
  return <Login />;
}
