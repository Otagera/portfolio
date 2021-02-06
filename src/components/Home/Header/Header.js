import React from 'react';
import { Box, Flex, Divider, Spacer, Link, Icon, Button,
		Drawer, DrawerHeader, DrawerContent, DrawerBody, DrawerOverlay, DrawerCloseButton, DrawerFooter,
		useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { ColorModeSwitcher } from '../../../containers/App/ColorModeSwitcher';

import NameBrand from '../../UI/NameBrand/NameBrand';;

const Header = ( props )=>{
	const bgColor = useColorModeValue('white', '#1A202C');
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();
	return (
	    <Box h='70px' zIndex='sticky' boxShadow='2xl' w='100%' position='fixed' bg={bgColor} top={0} py={3} pr={5}>
			<Flex h='50px'>
		        {/*<NameBrand w='20em' h='2.5em' nameBrandType='sentenceCaseWithOTop'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='sentenceCaseWithOTopThemeColor'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='sentenceCaseWithNordicO'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='sentenceCaseWithNordicOThemeColor'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='initialsOTA'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='initialsOTAThemeColor'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='capitalStraightMid'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='capitalStraightMidThemeColor'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='capitalStraightThin'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='capitalStraightThinThemeColor'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='sentenceCaseSlightlyCursive'/>*/}
		        <NameBrand w='10em' h='2.5em' nameBrandType='sentenceCaseSlightlyCursiveThemeColor'/>
		        {/*<NameBrand w='20em' h='2.5em' nameBrandType='capitalBarSeperatedBlock'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='capitalBarSeperatedBlockThemeColor'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='sentenceCaseWithCmpTop'/>
		        <NameBrand w='20em' h='2.5em' nameBrandType='sentenceCaseWithCmpTopThemeColor'/>*/}
				<Spacer />

				
			    <Flex my='auto' mx={['auto']} justifyContent='space-between' w={['80%', '45%', '25%']} display={['none', null, 'flex']}>
			        <Link href='https://github.com/Otagera' target='_blank'>
						<Icon as={FaGithub} boxSize='2em' />
			        </Link>
			        <Link href='https://twitter.com/LeoLenzo_37' target='_blank'>
						<Icon as={FaTwitter} boxSize='2em' />
			        </Link>
			        <Link href='https://www.linkedin.com/in/othniel-agera-751a0237' target='_blank'>
						<Icon as={FaLinkedin} boxSize='2em' />
			        </Link>
			    </Flex>
				<Spacer  display={['none', null, 'initial']}/>
				<ColorModeSwitcher justifySelf="flex-end" mr={2}/>
				<Button ref={btnRef} color='current' onClick={onOpen} display={['initial', null, 'none']}>
					<Icon as={GiHamburgerMenu} boxSize='1.75em' />
				</Button>
				<Drawer isOpen={isOpen} placement='top' onClose={onClose} finalFocusRef={btnRef} size='sm'>
					<DrawerOverlay>
						<DrawerContent>
							
							<DrawerCloseButton />
							<DrawerHeader>
								<NameBrand w='10em' h='2.5em' nameBrandType='sentenceCaseSlightlyCursiveThemeColor'/>
							</DrawerHeader>
							<DrawerBody>
								
							</DrawerBody>
							<DrawerFooter>
								<Flex my='auto' mx={['auto']} justifyContent='space-between' w={['80%', '25%']}>
							        <Link href='https://github.com/Otagera' target='_blank'>
										<Icon as={FaGithub} boxSize='2em' />
							        </Link>
							        <Link href='https://twitter.com/LeoLenzo_37' target='_blank'>
										<Icon as={FaTwitter} boxSize='2em' />
							        </Link>
							        <Link href='https://www.linkedin.com/in/othniel-agera-751a0237' target='_blank'>
										<Icon as={FaLinkedin} boxSize='2em' />
							        </Link>
							    </Flex>
							</DrawerFooter>
						</DrawerContent>
					</DrawerOverlay>
				</Drawer>
			</Flex>
			<Divider />
	    </Box>
    );
}
export default Header;