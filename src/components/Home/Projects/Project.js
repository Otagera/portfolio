import React from 'react';
import { Badge, Box, Text, Heading, Link, Flex, Grid, Image } from '@chakra-ui/react';
import { FaLink } from 'react-icons/fa';

const project = ( props )=>{
	const { project, colStart, colEnd } = props;
	return (
		<Box colSpan='2' w={['95%', null, null, '450px', '535px']} borderWidth={['5px', '1px']}
			borderRadius='lg' minHeight='300px' gridColumnStart={[null, null, null, colStart]}
			gridColumnEnd={[null, null, null, colEnd]} boxShadow='dark-lg' m='auto' p='6' mb='5'
			_hover={{ 'scale': '1.05', 'transition': 'all 2s ease .5s'}}>
			<Image src={project.img} borderRadius='lg'/>
			<Heading as='h3'>{project.title}</Heading>
			<Text>{project.desc}</Text>
			<Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} >
				<Box colSpan={2}>
					<Text fontWeight='bold'>Technologies Used </Text>
					<Flex justifyContent='space-between' wrap='wrap'>
					{
						project.technologiesUsed && project.technologiesUsed.map(tech=>{
							return (
								<Badge colorScheme='teal' borderRadius='full' h='20px' key={tech}>{tech}</Badge>
							);
						})
					}
					</Flex>
				</Box>
				<Box colSpan={2} mr={0} textAlign='right'>
					{project.link.details && <Link w='max-content' d='inline-block' color="teal.500"
						href={project.link.details} fontWeight='bold'>
						<Flex> View Project Details <FaLink size='1em'/> </Flex>
					</Link>}
					{project.link.code && <Link w='max-content' d='inline-block' color="teal.500"
						href={project.link.code} fontWeight='bold' target="_blank">
						<Flex> View Code <FaLink size='1em'/> </Flex>
					</Link>}
					{project.link.livePreview && <Link w='max-content' d='inline-block' color="teal.500"
						href={project.link.livePreview} fontWeight='bold' target="_blank">
						<Flex> Live Preview <FaLink size='1em'/> </Flex>
					</Link>}
				</Box>
			</Grid>
		</Box>
	);
}
export default project;