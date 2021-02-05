import React, { Component } from 'react';
import { Box, Heading, Text, Grid, createIcon } from '@chakra-ui/react';
import { FaHtml5, FaCss3, FaSass, FaJsSquare, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiMysql } from 'react-icons/si';

import Tool from './Tool';

class Tools extends Component {
	state = {
		tools: [
			{
			  title: 'HTML5',
			  icon: FaHtml5
			},
			{
			  title: 'CSS3',
			  icon: FaCss3
			},
			{
			  title: 'Sass',
			  icon: FaSass
			},
			{
			  title: 'Javascript',
			  icon: FaJsSquare
			},
			{
			  title: 'React',
			  icon: FaReact
			},
			{
			  title: 'NodeJs',
			  icon: FaNodeJs
			},
			{
			  title: 'ExpressJs',
			  icon: createIcon({
			            displayName: 'ExternalExpressIcon',
			            viewBox: '0 0 32 32',
			            path: (
			              <path fill='currentColor' d="M32 24.795c-1.164.296-1.884.013-2.53-.957l-4.594-6.356-.664-.88-5.365 7.257c-.613.873-1.256 1.253-2.4.944l6.87-9.222-6.396-8.33c1.1-.214 1.86-.105 2.535.88l4.765 6.435 4.8-6.4c.615-.873 1.276-1.205 2.38-.883l-2.48 3.288-3.36 4.375c-.4.5-.345.842.023 1.325L32 24.795zM.008 15.427l.562-2.764C2.1 7.193 8.37 4.92 12.694 8.3c2.527 1.988 3.155 4.8 3.03 7.95H1.48c-.214 5.67 3.867 9.092 9.07 7.346 1.825-.613 2.9-2.042 3.438-3.83.273-.896.725-1.036 1.567-.78-.43 2.236-1.4 4.104-3.45 5.273-3.063 1.75-7.435 1.184-9.735-1.248C1 21.6.434 19.812.18 17.9c-.04-.316-.12-.617-.18-.92q.008-.776.008-1.552zm1.498-.38h12.872c-.084-4.1-2.637-7.012-6.126-7.037-3.83-.03-6.58 2.813-6.746 7.037z"/>
			            )
			        })
			},
			{
			  title: 'MongoDB',
			  icon: SiMongodb
			},
			{
			  title: 'MySQL',
			  icon: SiMysql
			}
		]
	}
	render(){
		const { tools } = this.state;
		return (
	        <Box  ml='auto' w={['100%', '95%']}>
				<Heading as='h3' textAlign='justify'>Tools I Work With</Heading>
				<Text>
					With my background in computer science, I have been able to gain a solid understanding of concepts in computer science,
					and with dedication I have been able to spend my free time in outting these concepts to use in real world applications.  
				</Text>
				<Grid w={['95%', '70%']} templateColumns='repeat(3, 1fr)' mx='auto' my='3' justifyItems='center'>
					{
						tools.map((tool, i)=>{
							let colStart, colEnd = null;
							let rowStart = Number.parseInt(i/3) + 1;
							if((tools.length % 3) === 1 && i === tools.length - 1){ colStart = 1; colEnd = 4;}
							else if((tools.length % 3) === 2){ 
								if(i === tools.length - 2){ colStart = 1; colEnd = 3; }
								else if(i === tools.length - 1){ colStart = 2; colEnd = 4; }
							}
							return (
								<Tool tool={tool} colStart={colStart} colEnd={colEnd} rowStart={rowStart} key={tool.title} />
							);
						})
					}
				</Grid>
	        </Box>
		);
	}
}
export default Tools;