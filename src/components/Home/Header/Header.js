import React from 'react';
import { Box, Flex, Divider, Heading, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../../containers/App/ColorModeSwitcher';

const header = ( props )=>{
	return (
	    <Box h='55px' zIndex='sticky' boxShadow='2xl' w='100%'>
			<Flex h='50px'>
				<Heading as='h1'>Othniel</Heading>
				<Spacer />
				<ColorModeSwitcher justifySelf="flex-end" />
			</Flex>
			<Divider />
	    </Box>
    );
}
export default header;