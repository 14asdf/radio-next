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
import { FaVk } from 'react-icons/fa';
import Logo from '../components/shared/Logo';

const Login = () => {
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
              <Text fontSize="xl">Login to</Text>
              <Logo />
            </Center>

            {/* Social Login Buttons */}
            <VStack spacing={3} mt="16" gap={6}>
              <Button
                display="flex"
                gap={2}
                alignItems="center"
                borderRadius="full"
                w="100%"
              >
                <FcGoogle size={20} />
                Continue with Google
              </Button>

              <Button
                display="flex"
                gap={2}
                alignItems="center"
                borderRadius="full"
                w="100%"
              >
                <FaVk size={20} color="#0077FF" />
                Continue with VK
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

export default Login;
