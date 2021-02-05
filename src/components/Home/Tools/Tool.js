import React from 'react';
import { Box, Text, Icon } from '@chakra-ui/react';

const tool = ( props )=>{
	const { colStart, colEnd, rowStart, tool } = props;
	return (
		<Box colSpan={2} w='100px' borderWidth='1px'  borderRadius='lg' mb='5'
			opacity='1.5' overflow='hidden' h='100px' boxShadow='dark-lg'
			gridColumnStart={colStart} gridColumnEnd={colEnd} gridRowStart={rowStart} >
			<Box m='auto' w='100%' py='3' borderBottomRadius='md' borderBottomWidth='1px'>
				<Box w='max-content' m='auto'>
					<Icon as={tool.icon} boxSize='2em'/>
				</Box>
			</Box>
			<Box m='auto' w='max-content'>
				<Text> {tool.title} </Text>
			</Box>
		</Box>
	);
}
export default tool;