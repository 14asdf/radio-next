'use client';
import {
  Box,
  IconButton,
  Text,
  Input,
  VStack,
  Center,
  Image,
  Separator,
  Button,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import Logo from '../components/shared/Logo';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../utils/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

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

      // Create user profile in RTDB if it doesn't exist
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
    <Box>
      <Center py={8}>
        <Box maxW="450px" w="100%" px={6}>
          <VStack
            spacing={8}
            align="stretch"
            p={8}
            borderRadius="xl"
            bg="gray.100"
            _dark={{ bg: 'gray.800' }}
          >
            {/* Logo */}
            <Center gap="2">
              <Text fontSize="lg">{t('loginTo')}</Text>
              <Logo />
            </Center>

            {/* Social Login Buttons */}
            <VStack spacing={3} mt="16" gap={6}>
              <Button
                onClick={handleGoogleLogin}
                display="flex"
                gap={2}
                alignItems="center"
                borderRadius="full"
                w="100%"
              >
                <FcGoogle size={20} />
                {t('continueWithGoogle')}
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

export default Login;
