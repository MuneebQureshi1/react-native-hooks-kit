/**
 * useForceUpdateCheck.ts
 *
 * This hook checks for app updates using react-native-version-check.
 * It returns a boolean indicating whether an update is needed.
 * If an update is required, it shows an alert and forces the user to update.
 *
 * Usage:
 * const isUpdateNeeded = useForceUpdateCheck();
 */

import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

const useForceUpdateCheck = (): boolean => {
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const res = await VersionCheck.needUpdate();

        if (res?.isNeeded) {
          setIsUpdateNeeded(true);

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

  return isUpdateNeeded;
};

export default useForceUpdateCheck;
