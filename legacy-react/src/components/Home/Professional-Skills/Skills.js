import React from 'react';
import { Box, Heading, List, ListItem, ListIcon } from '@chakra-ui/react';

import { MdCheckCircle } from 'react-icons/md';

const skills = ( props )=>{
	const professionalSkills = ['Effective Communication', 'Strong Problem Solver', 'Team Player'];
	return (
        <Box ml='auto' w={['100%', '95%']}>
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
    );
}
export default skills;