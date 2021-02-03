import React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  theme
} from '@chakra-ui/react';

import Header from '../../components/Home/Header/Header';
import Intro from '../../components/Home/Intro/Intro';
import Tools from '../../components/Home/Tools/Tools';
import Skills from '../../components/Home/Professional-Skills/Skills';
import Projects from '../../components/Home/Projects/Projects';
import About from '../../components/Home/About/About';
import Contact from '../../components/Home/Contact/Contact';
import Footer from '../../components/Home/Footer/Footer';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="justify" fontSize="xl" minH="100vh" p={3}>
        <Header />
        <VStack spacing={8}>
          <Intro />
          <Tools />
          <Skills />
          <Projects />
          <About />
          <Contact />
          <Footer />
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
/*
<Logo h="40vmin" pointerEvents="none" />
<Text>
  Edit <Code fontSize="xl">src/App.js</Code> and save to reload.
</Text>
<Link
  color="teal.500"
  href="https://chakra-ui.com"
  fontSize="2xl"
  target="_blank"
  rel="noopener noreferrer"
>
  Learn Chakra
</Link>
*/