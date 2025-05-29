/**
 * useHideTabBar.tsx
 *
 * This hook is used to hide the tab bar on a screen.
 * It is useful when you need to hide the tab bar on a screen.
 * Usage:
 * useHideTabBar({navigation});
 *
 * @param navigation - The navigation object.
 */


import {useEffect} from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

// Define the type for the hook props
type UseHideTabBarProps = {
  navigation: NavigationProp<ParamListBase>;
};

export const useHideTabBar = ({navigation}: UseHideTabBarProps) => {
  useEffect(() => {
    // Hide the tab bar on this screen
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    // Reset the tab bar visibility when leaving the screen
    return () => {
      navigation.getParent()?.setOptions({
        //@ts-ignore
        //Add your tabBarStyle here uncomment it
        //tabBarStyle: globalStyle.bottomBarStlye,
      });
    };
  }, [navigation]);
};
