/**
 * useSocialAuth.tsx
 *
 * This hook is used to handle social authentication.
 * It is useful when you need to handle social authentication.
 * Apple Auth: https://github.com/invertase/react-native-apple-authentication
 * Google Auth: https://github.com/react-native-google-signin/google-signin
 * Facebook Auth: https://github.com/facebook/react-native-fbsdk-next
 * @param onSuccess - The function to call when the social authentication is successful.
 */

import appleAuth from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { LoginManager, AccessToken, Profile } from "react-native-fbsdk-next";
import { EnvironmentVariable } from "../constants/env";

interface UseSocialAuthProps {
  onSuccess: (response: any) => void;
}

export const useSocialAuth = ({ onSuccess }: UseSocialAuthProps) => {
  const [socialAuthLoginLoading, setSocialAUthLoginLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: EnvironmentVariable.webClientID,
      offlineAccess: true,
      iosClientId: EnvironmentVariable.iosClientID,
    });
    Settings.initializeSDK();
  }, []);


  //Apple Auth
  const handleAppleLogin = useCallback(async () => {
    setSocialAUthLoginLoading(true);
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const { user, identityToken } = appleAuthRequestResponse;
      if (identityToken) {
        try {
          const credentialState = await appleAuth.getCredentialStateForUser(
            user
          );
          if (credentialState === appleAuth.State.AUTHORIZED) {
            onSuccess(appleAuthRequestResponse);
          } else {
            console.log(
              "Apple credentialState not authorized:",
              credentialState
            );
            if (__DEV__) {
              onSuccess(appleAuthRequestResponse);
            }
          }
        } catch (e) {
          console.log("Credential check failed (simulator fallback):", e);
          onSuccess(appleAuthRequestResponse);
        }
      } else {
        console.log("No identity token returned from Apple Sign-In");
      }
    } catch (error) {
      console.log("Apple Auth Error", error);
    } finally {
      setSocialAUthLoginLoading(false);
    }
  }, [onSuccess]);



  //Google Auth
  const handleGoogleLogin = useCallback(async () => {
    setSocialAUthLoginLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      onSuccess(userInfo);
    } catch (error: any) {
      console.log("handleGoogleLogin", error);
    } finally {
      setSocialAUthLoginLoading(false);
    }
  }, [onSuccess]);


  
  //Facebook Auth
  const handleFacebookLogin = useCallback(async () => {
    setSocialAUthLoginLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        console.log("Facebook login cancelled");
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        console.log("Failed to get Facebook access token");
        return;
      }

      const profile = await Profile.getCurrentProfile();
      onSuccess(profile);
    } catch (error) {
      console.log("Facebook login error", error);
    } finally {
      setSocialAUthLoginLoading(false);
    }
  }, [onSuccess]);

  return {
    handleAppleLogin,
    handleGoogleLogin,
    handleFacebookLogin,
    socialAuthLoginLoading,
    setSocialAUthLoginLoading,
  };
};
