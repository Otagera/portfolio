import React from 'react';
import { Box, Text, HStack, Link, VStack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box w="full" py={10} borderTop="1px solid" borderColor="gray.800">
      <VStack align="start" spacing={4}>
        <Text color="teal.400">$ ls contact/</Text>
        <HStack spacing={6} fontSize="sm">
          <Link href="https://github.com/Otagera" isExternal>github</Link>
          <Link href="https://linkedin.com/in/othniel-agera-751a0237" isExternal>linkedin</Link>
          <Link href="https://twitter.com/LeoLenzo_37" isExternal>twitter</Link>
          <Link href="mailto:othnielagera@gmail.com">email</Link>
        </HStack>
        <Text fontSize="xs" color="gray.600" mt={4}>
          © {new Date().getFullYear()} Othniel Agera. Built with Monospace precision.
        </Text>
      </VStack>
    </Box>
  );
}

export default Footer;
