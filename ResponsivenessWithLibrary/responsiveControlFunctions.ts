/**
 * With this library we can control the responsiveness of the app.
 * This file is used to control the responsiveness of the app.
 * It is used to convert the pixels to the responsive pixels.
 * Library: https://github.com/n4kz/react-native-responsive-screen
 */


import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export const verticalResponsive = (pixels: any) => {
	return hp(pixels / 8);
};
export const horizontalResponsive = (pixels: any) => {
	return wp(pixels / 4);
};
