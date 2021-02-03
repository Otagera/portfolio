import React from 'react';
import { Box, Text, Heading, Flex, Image } from '@chakra-ui/react';

import midImage from '../../../assets/images/555x300.png';

const about = ( props )=>{
	return (
        <Box mx='auto' w={['100%', '95%']}>
          <Heading as='h1' my={10}>
            Hello world, I'm Othniel a
              <Text color='teal.500' as='em'> fullstack developer. </Text>
          </Heading>
          <Flex direction={['column', null, 'row-reverse']} w={['100%', null, '90%', '80%']} mx='auto'>
            <Image src={midImage} mx='auto' borderRadius='50%' w={['100%', null, '45%']} />
            <Text py={2} w={['100%', null, '45%']} my='auto'>
              I write clean, high functioning applications and maintainable code, while aiming for the very best user experience possible.
              I also have great concern for best practices while building soluions that involve automating tasks hitherto done manually.
            </Text>
          </Flex>
        </Box>
	);
}
export default about;