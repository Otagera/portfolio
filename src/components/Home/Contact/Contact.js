import React from 'react';
import { Box, Heading, Flex, Text, Link, Icon } from '@chakra-ui/react';

import { FaLink, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { VscSmiley } from 'react-icons/vsc';

const contact = ( props )=>{
	return (
	    <Box ml='auto' w={['100%', '95%']}>
	      <Heading as='h3' textAlign={['left', 'justify']} >Like For Us Build Something Together?</Heading>
	      <Flex><Text>Looking for a developer to work with, ask a question or looking to connect? Feel free to hit me up.</Text><VscSmiley /></Flex>
	      <Link color="teal.500" href='mailto:otagera@gmail.com' fontWeight='bold' target="_blank" w='max-content' d='inline-block' >
	          <Flex> otagera@gmail.com <FaLink size='1em'/> </Flex>
	      </Link>
	      <Flex my='auto' justifyContent='space-between' w='25%'>
	        <Link href='https://github.com/Otagera' target='_blank'>
	          <Icon as={FaGithub} boxSize='2em' />
	        </Link>
	        <Link href='https://twitter/leolenzo_37' target='_blank'>
	          <Icon as={FaTwitter} boxSize='2em' />
	        </Link>
	        <Link href='https://linkedin/Othniel' target='_blank'>
	          <Icon as={FaLinkedin} boxSize='2em' />
	        </Link>
	      </Flex>
	    </Box>
	);
}
export default contact;