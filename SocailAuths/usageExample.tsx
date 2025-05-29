import { useSocialAuth } from "./useSocialAuth";

const {handleGoogleLogin, socialAuthLoginLoading: googleAuthCheckLoading} =
    useSocialAuth({
      onSuccess: data => {
        // your logic here
      },
    });
  const {handleAppleLogin, socialAuthLoginLoading: handleAppleLoginLoading} =
    useSocialAuth({
      onSuccess: data => {
         // your logic here
        
      },
    });