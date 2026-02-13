import React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
} from '@chakra-ui/react';
import theme from '../../theme';

import Header from '../../components/Home/Header/Header';
import Intro from '../../components/Home/Intro/Intro';
import Projects from '../../components/Home/Projects/Projects';
import Footer from '../../components/Home/Footer/Footer';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box 
        maxW="80ch" 
        mx="auto" 
        fontSize="md" 
        minH="100vh" 
        p={6}
        pt={24}
      >
        <Header />
        <VStack spacing={20} align="stretch">
          <Intro />
          <Projects />
          <Footer />
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;