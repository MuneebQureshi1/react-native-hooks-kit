/**
 * useCallApiWhenRequired.tsx
 *
 * This hook is used to call an API function when a specific condition is met.
 * It is useful when you need to call an API function only when a specific condition is met.
 *
 * @param apiFunction - The API function to call.
 * @param onSuccess - The function to call when the API call is successful.
 */

import {useState} from 'react';

const useCallApiWhenRequired = (
  apiFunction: (data?: any, apiParameter?: any) => Promise<any>,
  onSuccess?: (data: any) => void,
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (params: {} = {}, apiParameter?: any) => {
    // Default to an empty object
    setLoading(true);
    setError(null);
    try {
      const results: any = await apiFunction(params, apiParameter);
      if (__DEV__) {
        console.log(`Result ${JSON.stringify(params)}`, results);
      }
      setData(results);
      if (results && onSuccess) {
        onSuccess(results);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return {data, loading, error, callApi};
};

export default useCallApiWhenRequired;
