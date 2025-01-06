'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/Login';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  return <Login />;
}
