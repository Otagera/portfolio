import React from 'react';
import { Box, Text, VStack, Link, HStack } from '@chakra-ui/react';
import { projects, writing } from '../../../data/content';

const Projects = () => {
  return (
    <Box w="full" id="projects">
      <VStack align="start" spacing={16}>
        <Box w="full">
          <Text color="teal.400" mb={6}>$ ls -la projects/</Text>
          <VStack align="stretch" spacing={8}>
            {projects.map((project) => (
              <Box key={project.title} borderLeft="2px solid" borderColor="gray.800" pl={6} py={2} _hover={{ borderColor: 'teal.500' }} transition="all 0.2s">
                <HStack justify="space-between" align="baseline">
                  <Link href={project.link} isExternal fontWeight="bold" fontSize="lg" color="teal.300">
                    {project.title}
                  </Link>
                  <Text fontSize="xs" color="gray.600" fontFamily="mono">{project.year}</Text>
                </HStack>
                <Text fontSize="sm" color="gray.400" mt={2} lineHeight="tall">{project.desc}</Text>
                <HStack spacing={3} mt={4}>
                  {project.tech.map(t => (
                    <Text key={t} fontSize="xs" color="gray.500" bg="gray.900" px={2} py={0.5} borderRadius="sm">
                      {t}
                    </Text>
                  ))}
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        <Box w="full" id="writing">
          <Text color="teal.400" mb={6}>$ cat writing/recent_logs.md</Text>
          <VStack align="stretch" spacing={10}>
            {writing.map((post) => (
              <Box key={post.title} group cursor="pointer">
                <HStack justify="space-between" mb={1}>
                  <Text fontWeight="bold" fontSize="md" _groupHover={{ color: 'teal.300' }}>{post.title}</Text>
                  <Text fontSize="xs" color="gray.600" whiteSpace="nowrap">{post.date}</Text>
                </HStack>
                <Text fontSize="sm" color="gray.500" mb={2}>{post.summary}</Text>
                <Text fontSize="xs" color="teal.600">{post.readTime} read</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default Projects;
