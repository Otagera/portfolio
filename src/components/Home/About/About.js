import React from 'react';
import { Box, Heading, Flex, Text, Divider, createIcon, Icon, useColorModeValue } from '@chakra-ui/react';

import Aux from '../../../hoc/Auxillary/Auxillary';

const About = ( props )=>{
	const quoteSvg = createIcon({
	    displayName: 'Double Quote',
	    viewBox: '0 0 32 32',
	    path: (
	      <Aux>
	        <path d="M0,4v12h8c0,4.41-3.586,8-8,8v4c6.617,0,12-5.383,12-12V4H0z"/>
			<path d="M20,4v12h8c0,4.41-3.586,8-8,8v4c6.617,0,12-5.383,12-12V4H20z"/>
	      </Aux>
	    )
	});
	const quoteFill = useColorModeValue('cyan.900', 'cyan.100');
	return (
        <Box ml='auto' w={['100%', '95%']}>
          <Heading as='h3' mx='auto'>Who is Othniel?</Heading>
          <Icon as={quoteSvg} boxSize='6em' fill={quoteFill} opacity='0.1' ml={[0, 100]} position='absolute'/>
          <Flex direction={['column', 'row']} w={['95%', '80%']} mx='auto'>
            <Box w={['100%', '50%']} p={3}>
              <Text py={2}>
                I am a graduate of Mathematics/Computer Science from the University of Agriculture,
                Makurdi, Nigeria. After school i have gone on to learn Frontend web development
                from Colab's Code School.
              </Text>
              <Text py={2}>
                Short story, my first encounter with programming was QBASIC without learning much,
                I then went on to C++ same thing - didn't learn much.
                Then came Java and i went with that for a while,
                going on to learn how to design desktop application using JavaFX and backend development.
                Then came web development and I have gone on to learn (and I'm still learning)
                front-end web development followed with back-end development and database management.
              </Text>
            </Box>
            <Divider orientation='vertical' d={['none', 'block']}/>
            <Box w={['100%', '50%']} p={3}>
              <Text py={2}>
                Over the past year I've grown as a developer even with prior knowledge in programming.
                I've learnt how the web works fundamentally, built websites and applications using
                different tools from KnockoutJS, BackboneJs and presently ReactJs with Scss and ejs
                template engine while working with express in the frontend. In the backend I only
                have experience with Express Js and mongoose for interfacing with MongoDB database.
              </Text>
              <Text py={2}>
                With each of these experience I have gone on to create some wondeful products which
                I'm delighted to showcase to you in this portfolio.
              </Text>                
            </Box>
          </Flex>
        </Box>
    );
}
export default About;