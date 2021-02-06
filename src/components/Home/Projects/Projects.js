import React, { Component } from 'react';
import { Box, Text, Heading, Grid } from '@chakra-ui/react';

import salesAppJsImg from '../../../assets/images/Sales-App-Just-JS/Start.jpg';
import salesAppExpressImg from '../../../assets/images/Sales-App-Express/Home.jpg';
import jobListingsImg from '../../../assets/images/Job-Listing/Listings.jpg';
import rpsImg from '../../../assets/images/RPS/Home.jpg';
import eVotingImg from '../../../assets/images/E-Voting/Home Alt.jpg';
import Project from './Project';

class Projects extends Component{
	state = {
		projects: [
			{
				img: jobListingsImg,
				title: 'Job Listing',
				desc: 'A job listings web app for companies to create job listings for prospective emplotees to see and apply for.',
				technologiesUsed: ['ReactJS', 'SCSS', 'ExpressJS', 'MongoDB', 'NodeJS', 'Cloudinary'],
				link: {
					//details: '/project/job-listing',
					code: 'https://github.com/Otagera/job-listings',
					livePreview: 'https://lenxo-listings.netlify.app'
				}
			},
			{
				img: rpsImg,
				title: 'RPS - Rock, Paper, Scissors',
				desc: 'A simple Rock, Paper, & Scissors game with a bonus stage that includes Spoock & Lizard.',
				technologiesUsed: ['ReactJS', 'SCSS'],
				link: {
					//details: '/project/rps',
					code: 'https://github.com/Otagera/rps',
					livePreview: 'https://lenxo-rps.netlify.app'
				}
			},
			{
				img: eVotingImg,
				title: 'E-Voting',
				desc: 'A simple E-voting platform for companies to create poll for the public tpo vote on.',
				technologiesUsed: ['ReactJS', 'Redux', 'SCSS', 'ExpressJS', 'MongoDB', 'NodeJS', 'Cloudinary'],
				link: {
					//details: '/project/e-voting',
					code: 'https://github.com/Otagera/e-voting',
					livePreview: 'https://e-voting-lenxo.netlify.app'
				}
			},{
				img: salesAppJsImg,
				title: 'Sales App - Pure Javascript',
				desc: 'A sales application for stockist to use to track inventory and keep a digital copy of orders made.',
				technologiesUsed: ['HTML5', 'CSS', 'Javascript', 'jQuery', 'SimpleBar'],
				link: {
					//details: '/project/sales-app-js',
					code: 'https://github.com/Otagera/Sales-App-Basic',
					livePreview: 'https://trusting-mcnulty-b795fc.netlify.app'
				}
			},
			{
				img: salesAppExpressImg,
				title: 'Sales App - Express',
				desc: `A sales application for stockist to use to track inventory and keep a digital copy of orders made.
						With improvements from the one with pure js, this one has a mongoDB to store these data and its
						being served from an express server.`,
				technologiesUsed: ['ExpressJs', 'MongoDB', 'NodeJS', 'Ejs template engine', 'jQuery', 'SimpleBar'],
				link: {
					//details: '/project/sales-app-express',
					code: 'https://github.com/Otagera/Sales-App-Express',
					livePreview: 'https://gentle-earth-84384.herokuapp.com'
				}
			}
		]
	}
	render(){
		const { projects } = this.state;
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
								<Project project={project} colStart={colStart} colEnd={colEnd} key={project.title} />
							);
						})
					}
				</Grid>
	        </Box>
	    );
	}
}
export default Projects;