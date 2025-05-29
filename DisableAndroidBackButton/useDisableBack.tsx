/**
 * useDisableBack.tsx
 *
 * This hook is used to disable the back button on a screen.
 * It is useful when you need to disable the back button on a screen.
 *
 * Usage:
 * useDisableBack();
 *
 * @param navigation - The navigation object.
 * @param beforeRemoveListener - The function to call before the screen is removed.
 */

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';

const useDisableBack = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();  // app close karo
        return true;             // event handled hai
      };

      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
      }

      const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
        e.preventDefault();     // default back navigation rok do
        BackHandler.exitApp();  // app close karo
      });

      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
        beforeRemoveListener();
      };
    }, [navigation])
  );
};

export default useDisableBack;
