import React from 'react';
import {
  ChakraProvider,
  Badge,
  Box,
  Text,
  Heading,
  Link,
  Flex,
  Grid,
  VStack,
  Spacer,
  Divider,
  List,
  ListItem,
  ListIcon,
  //Code,
  Image,
  theme
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
//import { Logo } from './Logo';
import expSvg from '../../assets/svgs/expressjs-icon.svg';
import largeImage from '../../assets/images/1140x350.png';
import midImage from '../../assets/images/555x300.png';
import smallImage from '../../assets/images/100.png';
import { FaHtml5, FaCss3, FaSass, FaJsSquare, FaReact, FaNodeJs, FaLink } from 'react-icons/fa';
import { SiMongodb, SiMysql } from 'react-icons/si';
import { VscSmiley } from 'react-icons/vsc';
import { MdCheckCircle } from 'react-icons/md';

function App() {
  const tools = [
    {
      title: 'HTML5',
      iconType: 'react-icons',
      icon: FaHtml5
    },
    {
      title: 'CSS3',
      iconType: 'react-icons',
      icon: FaCss3
    },
    {
      title: 'Sass',
      iconType: 'react-icons',
      icon: FaSass
    },
    {
      title: 'Javascript',
      iconType: 'react-icons',
      icon: FaJsSquare
    },
    {
      title: 'React',
      iconType: 'react-icons',
      icon: FaReact
    },
    {
      title: 'NodeJs',
      iconType: 'react-icons',
      icon: FaNodeJs
    },
    {
      title: 'ExpressJs',
      iconType: 'raw-svg',
      icon: expSvg
    },
    {
      title: 'MongoDB',
      iconType: 'react-icons',
      icon: SiMongodb
    },
    {
      title: 'MySQL',
      iconType: 'react-icons',
      icon: SiMysql
    }
  ];
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
    },
    {
      img: smallImage,
      title: 'Decoreeee',
      desc: 'A simple tool to help web developers build live, custom, templates & export code.',
      technologiesUsed: ['HTML5', 'SCSS', 'Javascript', 'Node'],
      link:{
        details: 'portfolio.io/decore',
        code: 'github.com/Otagera/decore',
        livePreview: 'decore.netlify.app'
      }
    }
  ];
  const professionalSkills = ['Effective Communication', 'Strong Problem Solver', 'Team Player'];
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="justify" fontSize="xl">
        <Grid minH="100vh" p={3}>
        {/*position='fixed'*/}
          <Box h='55px' zIndex='sticky' boxShadow='2xl' w='100%'>
            <Flex h='50px'>
              <Heading as='h1'>Othniel</Heading>
              <Spacer />
              <ColorModeSwitcher justifySelf="flex-end" />
            </Flex>
            <Divider />
          </Box>
          <VStack spacing={8}>
            <Box mx='auto' w='95%'>
              <Heading as='h1' my={10}>
                Hello world, I'm Othniel a
                  <Text color='teal.500' as='em'> fullstack developer. </Text>
              </Heading>
              <Image src={midImage} mx='auto'/>
              <Heading as='h3' mx='auto'>Who is Othniel?</Heading>
              <Flex direction='row' w='80%' mx='auto'>
                <Box w='50%' p={3}>
                  <Text py={2}>
                    My first encounter with programming was QBASIC without learning much i went on to C++ same thing - didn't learn much.
                    Then came Java and i went with that for a while, going on to learn to design desktop application wwith JavaFX and backend development.
                    Then came web development and I have gone on to learn front-end web development followed with back-end development.
                  </Text>
                  <Text py={2}>
                    I am a graduate of Mathematics/Computer Science from the University of Agriculture, Makurdi. After school i have gone on to learn
                    Frontend web development from Colab's Code School.
                  </Text>
                </Box>
                <Divider orientation='vertical'/>
                <Box w='50%' p={3}>
                  <Text py={2}>
                    Over the past year ive grown as a developer even with prior knowledge in programming. After a brief experience with C++, and learning
                    up to backend development and desktop application in Java i decided to try out web development.
                  </Text>
                  <Text py={2}>
                    With each of these experience I have gone on to create some wondeful products which i would be delighted to showcase to ypu in this portfolio
                  </Text>                
                </Box>
              </Flex>
            </Box>
            <Box  ml='auto' w='95%'>
              <Heading as='h3' textAlign='justify'>Tools I Work With</Heading>
              <Text>
                With my background in computer science, I have been able to gain a solid understanding of concepts in computer science,
                and with dedication I have been able to spend my free time in outting these concepts to use in real world applications.  
              </Text>
              <Grid w='70%' templateColumns='repeat(3, 1fr)' m='auto' justifyItems='center'>
              {
                tools.map(tool=>{
                  let IconDisplay = null;
                  if(tool.iconType === 'react-icons'){
                    let Icon = tool.icon;
                    IconDisplay = <Icon size='2em'/>;
                  }else{                    
                    IconDisplay = <Image src={tool.icon} w='2em' fill='current' />;
                  }
                  return (
                    <Box colSpan='2' w='100px' borderWidth='1px'  borderRadius='lg' mb='5' opacity='1.5'
                      overflow='hidden' h='100px' boxShadow='dark-lg' key={tool.title}>
                      <Box m='auto' w='100%' py='3' borderBottomRadius='md' borderBottomWidth='1px'>
                        <Box w='max-content' m='auto'>
                          {IconDisplay}
                        </Box>
                      </Box>
                      <Box m='auto' w='max-content'>
                        <Text> {tool.title} </Text>
                      </Box>
                    </Box>
                    );
                })
              }
              </Grid>
            </Box>
            <Box ml='auto' w='95%'>
              <Heading as='h3' textAlign='justify'>Professional Skills</Heading>
              <List spacing={3}>
              {
                professionalSkills.map(skill=>{
                  return (
                    <ListItem key={skill}>
                      <ListIcon as={MdCheckCircle} />
                      {skill}
                    </ListItem>
                  );
                })
              }
              </List>
            </Box>
            <Box ml='auto' w='95%'>
              <Heading as='h3' textAlign='justify'>Selected Projects</Heading>
              <Text>
                I've always known that the key to being good at something is constant practice and I do not like to be idle so I always have
                a project to work on. Take a look at some of the applications I've dedicated my time to.
              </Text>
              <Grid w='90%' templateColumns='repeat(2, 1fr)' m='auto'>
              {
                projects.map(project=>{
                  return (
                    <Box colSpan='2'w='95%' borderWidth='5px'  borderRadius='lg' minHeight='300px'
                      boxShadow='dark-lg' key={project.title} m='auto' p='6' mb='5'>
                      <Image src={project.img} />
                      <Heading as='h3'>{project.title}</Heading>
                      <Text>{project.desc}</Text>
                      <Grid templateColumns='repeat(2, 1fr)'>
                        <Box colSpan='2'>
                          <Link 
                            color="teal.500"
                            href={project.link.details}
                            fontWeight='bold'>
                              <Flex> View Project Details <FaLink size='1em'/> </Flex>
                          </Link>
                          <Link 
                            color="teal.500"
                            href={project.link.code}
                            fontWeight='bold'
                            target="_blank">
                              <Flex> View Code <FaLink size='1em'/> </Flex>
                          </Link>
                          <Link 
                            color="teal.500"
                            href={project.link.livePreview}
                            fontWeight='bold'
                            target="_blank">
                              <Flex> Live Preview <FaLink size='1em'/> </Flex>
                          </Link>
                        </Box>
                        <Box colSpan='2'>
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
                      </Grid>
                    </Box>
                    );
                })
              }
              </Grid>
            </Box>
            <Box ml='auto' w='95%'>
              <Heading as='h3' mx='auto'>Who is Othniel?</Heading>
              <Flex direction='row' w='80%' mx='auto'>
                <Box w='50%' p={3}>
                  <Text py={2}>
                    My first encounter with programming was QBASIC without learning much i went on to C++ same thing - didn't learn much.
                    Then came Java and i went with that for a while, going on to learn to design desktop application wwith JavaFX and backend development.
                    Then came web development and I have gone on to learn front-end web development followed with back-end development.
                  </Text>
                  <Text py={2}>
                    I am a graduate of Mathematics/Computer Science from the University of Agriculture, Makurdi. After school i have gone on to learn
                    Frontend web development from Colab's Code School.
                  </Text>
                </Box>
                <Divider orientation='vertical'/>
                <Box w='50%' p={3}>
                  <Text py={2}>
                    Over the past year ive grown as a developer even with prior knowledge in programming. After a brief experience with C++, and learning
                    up to backend development and desktop application in Java i decided to try out web development.
                  </Text>
                  <Text py={2}>
                    With each of these experience I have gone on to create some wondeful products which i would be delighted to showcase to ypu in this portfolio
                  </Text>                
                </Box>
              </Flex>
            </Box>
            <Box ml='auto' w='95%'>
              <Heading as='h3' textAlign='justify'>Like For Us Build Something Together?</Heading>
              <Flex><Text>Looking for a developer to work with, ask a question or looking to connect? Feel free to hit me up.</Text><VscSmiley /></Flex>
              <Link 
                color="teal.500"
                href='mailto:otagera@gmail.com'
                fontWeight='bold'
                target="_blank">
                  <Flex> otagera@gmail.com <FaLink size='1em'/> </Flex>
              </Link>
            </Box>
          </VStack>
        </Grid>
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