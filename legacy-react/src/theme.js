import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'JetBrains Mono', monospace`,
    body: `'JetBrains Mono', monospace`,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0a0a0a' : '#f5f5f5',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
        lineHeight: '1.6',
      },
    }),
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '600',
        letterSpacing: '-0.02em',
      },
    },
    Link: {
      baseStyle: {
        color: 'teal.400',
        _hover: {
          textDecoration: 'none',
          color: 'teal.300',
        },
      },
    },
  },
});

export default theme;
