/**
 * useForceUpdateCheck.tsx
 *
 * This hook is used to check for updates and force the user to update the app.
 * It is useful when you need to check for updates and force the user to update the app.
 * Usage:
 * useForceUpdateCheck();
 */

import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

const useForceUpdateCheck = () => {
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const res = await VersionCheck.needUpdate();

        if (res?.isNeeded) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  if (res.storeUrl) {
                    Linking.openURL(res.storeUrl);
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.log('Version check failed:', error);
      }
    };

    checkUpdate();
  }, []);
};

export default useForceUpdateCheck;
