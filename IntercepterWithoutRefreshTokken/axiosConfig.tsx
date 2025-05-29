/**
 * axiosConfig.tsx
 *
 * This file is used to configure the axios instance.
 * It is used to add a request interceptor and a response interceptor.
 * It is used to add a secure storage function.
 * It is used to add a remove keys from secure storage function.
 *
 * Usage:
 * import { dataServer } from "./axiosConfig";
 *
 * const response = await dataServer.get("/api/v1/user");
 * console.log(response);
 */


import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

const UseAccessToken = async () => {
  // get access token from secure storage
  const AccessTokken = '';
  if (AccessTokken) {
    return AccessTokken;
  } else {
    return null;
  }
};

const dataServer = axios.create({
  baseURL: "", // add your base url here
  timeout: 100000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

dataServer.interceptors.request.use((config: any) => {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    NetInfo.addEventListener(async state => {
      const accessToken = await UseAccessToken();
      if (!state.isConnected) {
        return reject({message: 'No internet connection'});
      }
      if (config.data && config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return resolve(config);
    });
  });
});
dataServer.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error: any) => {
    if (error?.message === 'No internet connection') {
      Alert.alert(
        'It looks like you are offline. Please check your network and try again.',
      );
    }
    if (error?.response?.status === 401) {
      //When we use accessToken or our session expires we can do two methods on with refresh tokken and other is to navigate on login screen
      //   navigate();
    }
    return Promise.reject(error);
  },
);

export {dataServer};
