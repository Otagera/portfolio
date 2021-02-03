import React from 'react';
import { Badge, Box, Text, Heading, Link,
  Flex, Grid, Image } from '@chakra-ui/react';

import smallImage from '../../../assets/images/100.png';
import { FaLink } from 'react-icons/fa';

const projects = ( props )=>{
	const projects = [
		{
		  img: smallImage,
		  title: 'Decore',
		  desc: 'A simple tool to help web developers build live, custom, templates & export code.',
		  technologiesUsed: ['HTML5', 'SCSS', 'Javascript', 'Node', 'Ruby', 'Phython'],
		  link:{
		    details: 'portfolio.io/decore',
		    code: 'github.com/Otagera/decore',
		    livePreview: 'decore.netlify.app'
		  }
		},
		{
		  img: smallImage,
		  title: 'Decoree',
		  desc: 'A simple tool to help web developers build live, custom, templates & export code.',
		  technologiesUsed: ['HTML5', 'SCSS', 'Javascript', 'Node'],
		  link:{
		    details: 'portfolio.io/decore',
		    code: 'github.com/Otagera/decore',
		    livePreview: 'decore.netlify.app'
		  }
		},
		{
		  img: smallImage,
		  title: 'Decoreee',
		  desc: 'A simple tool to help web developers build live, custom, templates & export code.',
		  technologiesUsed: ['HTML5', 'SCSS', 'Javascript', 'Node'],
		  link:{
		    details: 'portfolio.io/decore',
		    code: 'github.com/Otagera/decore',
		    livePreview: 'decore.netlify.app'
		  }
		}
	];
	return (
        <Box ml='auto' w={['100%', '95%']}>
          <Heading as='h3' textAlign='justify'>Selected Projects</Heading>
          <Text>
            I've always known that the key to being good at something is constant practice and I do not like to be idle so I always have
            a project to work on. Take a look at some of the applications I've dedicated my time to.
          </Text>
          <Grid w={['98%', null, null, null, '90%']} templateColumns={['repeat(1, 1fr)', null, null, 'repeat(2, 1fr)']} m='auto' mt={10}>
          {
            projects.map((project, i)=>{
              let colStart, colEnd = null;
              if((projects.length % 2) === 1 && i === projects.length - 1){ colStart = 1; colEnd = 3; }
              return (
                <Box colSpan='2' w={['95%', null, null, '450px', '535px']} borderWidth={['5px', '1px']}  borderRadius='lg' minHeight='300px' gridColumnStart={[null, null, null, colStart]} gridColumnEnd={[null, null, null, colEnd]}
                  boxShadow='dark-lg' key={project.title} m='auto' p='6' mb='5'>
                  <Image src={project.img} />
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
                      <Link w='max-content' d='inline-block' color="teal.500"
                        href={project.link.details} fontWeight='bold'>
                          <Flex> View Project Details <FaLink size='1em'/> </Flex>
                      </Link>
                      <Link w='max-content' d='inline-block' color="teal.500"
                        href={project.link.code} fontWeight='bold' target="_blank">
                          <Flex> View Code <FaLink size='1em'/> </Flex>
                      </Link>
                      <Link w='max-content' d='inline-block' color="teal.500"
                        href={project.link.livePreview} fontWeight='bold' target="_blank">
                          <Flex> Live Preview <FaLink size='1em'/> </Flex>
                      </Link>
                    </Box>
                  </Grid>
                </Box>
                );
            })
          }
          </Grid>
        </Box>
    );
}
export default projects;