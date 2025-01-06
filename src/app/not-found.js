import { Suspense } from 'react';
import { Spinner, Text, VStack } from '@chakra-ui/react';

export default function NotFound() {
  return (
    <Suspense fallback={<Spinner size="xl" />}>
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Not Found
        </Text>
        <Text>Could not find requested resource</Text>
      </VStack>
    </Suspense>
  );
}
