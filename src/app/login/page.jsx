import Login from '@/components/Login';
import { generatePageMetadata } from '@/utils/metadata';

export const metadata = generatePageMetadata({
  title: 'Login',
  description:
    'Sign in to Radio Cloud to access your favorite radio stations and personalized features',
});

export default function LoginPage() {
  return <Login />;
}
