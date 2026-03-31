import React from 'react';
import { Box, Text, Heading, VStack, Code } from '@chakra-ui/react';

const Intro = () => {
  return (
    <Box w="full" py={10}>
      <VStack align="start" spacing={6}>
        <Box>
          <Text color="teal.400" mb={2}>$ whoami</Text>
          <Heading as="h1" size="xl">Othniel Agera</Heading>
          <Text fontSize="lg" color="gray.400" mt={2}>
            Backend Engineer / Systems Builder
          </Text>
        </Box>

        <Box>
          <Text color="teal.400" mb={2}>$ cat bio.txt</Text>
          <Text maxW="60ch">
            I build robust, scalable backend systems and clean APIs. 
            Currently focused on distributed systems, database optimization, and 
            architecting maintainable codebases. I prefer terminal-driven workflows 
             and minimalist design.
          </Text>
        </Box>

        <Box>
          <Text color="teal.400" mb={2}>$ ls stack/</Text>
          <Text color="gray.500" fontSize="sm">
            Node.js, Go, PostgreSQL, Redis, Docker, AWS
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default Intro;