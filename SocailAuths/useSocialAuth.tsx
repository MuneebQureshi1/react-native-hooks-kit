/**
 * useSocialAuth.tsx
 *
 * This hook is used to handle social authentication.
 * It is useful when you need to handle social authentication.
 * Apple Auth: https://github.com/invertase/react-native-apple-authentication
 * Google Auth: https://github.com/react-native-google-signin/google-signin
 * @param onSuccess - The function to call when the social authentication is successful.
 */

import appleAuth from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {EnvironmentVariable} from '../constants/env';

interface UseSocialAuthProps {
  onSuccess: (response: any) => void;
}

export const useSocialAuth = ({onSuccess}: UseSocialAuthProps) => {
  const [socialAuthLoginLoading, setSocialAUthLoginLoading] = useState(false);
  const [checkSocialAuth, setCheckSocialAuth] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: EnvironmentVariable.webClientID, // Client ID for the Android/iOS platform
      offlineAccess: true, // If you need offline access
      iosClientId: EnvironmentVariable.iosClientID,
    });
  }, []);

  const handleAppleLogin = useCallback(async () => {
    setSocialAUthLoginLoading(true);
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const {user, identityToken} = appleAuthRequestResponse;
      // If identityToken is present, we can proceed
      if (identityToken) {
        // Optionally verify credentialState on a real device
        try {
          const credentialState = await appleAuth.getCredentialStateForUser(
            user,
          );
          if (credentialState === appleAuth.State.AUTHORIZED) {
            onSuccess(appleAuthRequestResponse);
          } else {
            console.log('Apple credentialState not authorized:', credentialState);
            console.log('Apple credentialState not authorized:');
            if (__DEV__) {
              onSuccess(appleAuthRequestResponse);
            }
          }
        } catch (e) {
          console.log('Credential check failed (possibly simulator):', e);
          // If you're in development, fallback:
          onSuccess(appleAuthRequestResponse);
        }
      } else {
        console.log('No identity token returned from Apple Sign-In');
      }

      setCheckSocialAuth(true);
      setSocialAUthLoginLoading(false);
    } catch (error) {
      console.log('Apple Auth Error', error);
      setSocialAUthLoginLoading(false);
    }
  }, [onSuccess]);

  // Placeholder for other social logins (e.g., Google, Facebook)
  const handleGoogleLogin = useCallback(async () => {
    setSocialAUthLoginLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      onSuccess(userInfo);
      setSocialAUthLoginLoading(false);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
        console.log('handleGoogleLogin', error);
        // showMessage(error.message);
      }
      setSocialAUthLoginLoading(false);
    }
  }, [onSuccess]);

  return {
    handleAppleLogin,
    handleGoogleLogin,
    socialAuthLoginLoading,
    checkSocialAuth,
    setSocialAUthLoginLoading,
  };
};
