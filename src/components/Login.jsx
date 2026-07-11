'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../utils/firebase';
import Logo from './Logo';

const Login = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const t = useTranslations('auth');

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await set(ref(db, `users/${result.user.uid}`), {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        favorites: [],
        createdAt: Date.now(),
      });

      setUser(result.user);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-[450px] px-6">
          <div className="flex flex-col gap-8 rounded-xl bg-muted p-8 dark:bg-neutral-800">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{t('loginTo')}</span>
              <Logo />
            </div>

            <div className="mt-16 flex flex-col gap-6">
              <Button onClick={handleGoogleLogin} className="w-full gap-2 rounded-full">
                <FcGoogle size={20} />
                {t('continueWithGoogle')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
