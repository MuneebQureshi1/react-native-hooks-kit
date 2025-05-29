/**
 * axiosConfig.tsx
 *
 * This file is used to configure the axios instance.
 * It is used to add a request interceptor and a response interceptor.
 * It is used to add a refresh token function.
 * It is used to add a secure storage function.
 * It is used to add a remove keys from secure storage function.
 * These secure storage functions are used to store the access token and refresh token.
 * These are just helper functions to get the token from the secure storage.
 * You can use your own secure storage function.
 *
 * Usage:
 * import { dataServer } from "./axiosConfig";
 *
 * const response = await dataServer.get("/api/v1/user");
 * console.log(response);
 */

import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
//Use navigation or expo-router for navigation
import { router } from "expo-router";
import { Alert } from "react-native";



const UseAccessToken = async () => {
  const token = await getFromSecureStorage("@access_token"); // add your secure storage key here
  return token || null;
};

const UseRefreshToken = async () => {
  const token = await getFromSecureStorage("@refresh_token");
  return token || null;
};

const dataServer = axios.create({
  baseURL: "", // add your base url here
  timeout: 100000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
dataServer.interceptors.request.use((config: any) => {
  return new Promise((resolve, reject) => {
    NetInfo.addEventListener(async (state) => {
      const accessToken = await UseAccessToken();

      if (!state.isConnected) {
        return reject({ message: "No internet connection" });
      }

      if (config.data && config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return resolve(config);
    });
  });
});

// REFRESH TOKEN FUNCTION
const refreshToken = async () => {
  try {
    const token = await UseRefreshToken();
    if (!token) throw new Error("No refresh token found");

    const response = await axios.post(
      'refreshTokenUrl',
      // add your request body here
    );

    const newAccessToken = response.data.data.access_token;
    const newRefreshToken = response.data.data.refresh_token;

    await saveToSecureStorage("@access_token", newAccessToken);
    await saveToSecureStorage("@refresh_token", newRefreshToken);

    return newAccessToken;
  } catch (err) {
    console.log("Token refresh failed:", err);
    return null;
  }
};

// RESPONSE INTERCEPTOR
dataServer.interceptors.response.use(
  (response: any) => response.data,
  async (error: any) => {
    const originalRequest = error.config;

    const errorMessage = error?.message;

    if (
      errorMessage === "Network Error" ||
      errorMessage === "No internet connection" ||
      !error?.response
    ) {
      return new Promise((resolve, reject) => {
        Alert.alert(
          "No Internet Connection",
          "It looks like you are offline. Please check your internet connection.",
          [
            {
              text: "Retry",
              onPress: () => {
                resolve(dataServer(originalRequest));
              },
            },
            {
              text: "Cancel",
              onPress: () => {
                reject(error);
              },
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      });
    }

    if (
      error?.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return dataServer(originalRequest);
      } else {
        await removeKeysFromSecureStorage(["@access_token", "@refresh_token"]);
        console.log("Your session has expired. Please log in again.");
        router.push(`/login`);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export { dataServer };
