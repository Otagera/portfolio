import React from 'react';
import { Box, Flex, Divider, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../../containers/App/ColorModeSwitcher';

import NameBrand from '../../UI/NameBrand/NameBrand';;

const header = ( props )=>{
	return (
	    <Box h='55px' zIndex='sticky' boxShadow='2xl' w='100%'>
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
				<ColorModeSwitcher justifySelf="flex-end" />
			</Flex>
			<Divider />
	    </Box>
    );
}
export default header;