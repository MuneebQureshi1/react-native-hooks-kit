/**
 * useCallApiOnEveryLoad.tsx
 *
 * This hook is used to call an API function on every load.
 * It is useful when you need to call an API function on every load.
 *
 * @param apiFunction - The API function to call.
 * @param params - The parameters for the API function.
 * @param onSuccess - The function to call when the API call is successful.
 */


import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";

const useCallApiOnEveryLoad = (
  apiFunction: (data?: any) => Promise<any>,
  params?: any, // Parameters for the API function
  onSuccess?: (data: any) => void // Optional onSuccess callback
) => {
  const [data, setData] = useState<any[] | any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const callApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const results: any = await apiFunction(params); // Pass params to the api function
      if (__DEV__) {
        console.log("results", JSON.stringify(results));
      }
      setData(results);

      // If onSuccess is provided, call it with the results
      if (results && onSuccess) {
        onSuccess(results);
      }
      if (results) {
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.log(err.message);
    }
  };

  // Call the API on mount or when params change if shouldCallApi is true
  useEffect(() => {
    setLoading(true);
    setData([]);
    if (isFocused) {
      callApi();
    }
  }, [isFocused]); // Re-run when shouldCallApi or isFocus change

  return { data, loading, error, callApi, setLoading };
};

export default useCallApiOnEveryLoad;
