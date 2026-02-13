import React from 'react';
import { Box, Flex, Link, Text, HStack } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../../containers/App/ColorModeSwitcher';

const Header = () => {
  return (
    <Box 
      w="full" 
      position="fixed" 
      top={0} 
      left={0} 
      px={6} 
      py={4} 
      zIndex="sticky"
      bg="transparent"
      backdropFilter="blur(10px)"
    >
      <Flex maxW="80ch" mx="auto" justify="space-between" align="center">
        <HStack spacing={2}>
          <Text fontWeight="bold" color="teal.400">~/othniel-agera</Text>
          <Text color="gray.500">/</Text>
          <Link href="/" color="gray.400">home</Link>
        </HStack>
        
        <HStack spacing={6}>
          <Link href="#projects" fontSize="sm">projects</Link>
          <Link href="#writing" fontSize="sm">writing</Link>
          <ColorModeSwitcher />
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;