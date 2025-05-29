/**
 * useImagePicker.tsx
 *
 * This hook is used to pick an image from the library or take a photo.
 * It is useful when you need to pick an image from the library or take a photo.
 *
 * Usage:
 * const { pickFromLibrary, takePhoto } = useImagePicker();
 * const uri = await takePhoto/pickFromLibrary();
 * @param pickFromLibrary - The function to call when the user wants to pick an image from the library.
 * @param takePhoto - The function to call when the user wants to take a photo.
 * @returns {Object} - An object containing the pickFromLibrary and takePhoto functions.
 */

import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export type ImageObject = {
  uri: string;
  name: string | undefined;
  type: string | undefined;
};

export const useImagePicker = () => {
  const requestMediaLibraryPermission = async (): Promise<boolean> => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Access to your photo library is required to select images."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.log("Media Library Permission Error:", error);
      return false;
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Access to your camera is required to take photos."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.log("Camera Permission Error:", error);
      return false;
    }
  };

  const pickFromLibrary = async (): Promise<ImageObject | null> => {
    try {
      const hasPermission = await requestMediaLibraryPermission();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled) {
        const imageObject = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName,
          type: result.assets[0].mimeType,
        };
        return imageObject;
      }
      return null;
    } catch (error) {
      console.log("Failed to open image library:", error);
      return null;
    }
  };

  const takePhoto = async (): Promise<ImageObject | null> => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageObject = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName,
          type: result.assets[0].mimeType,
        };
        return imageObject;
      }
      return null;
    } catch (error) {
      console.log("Failed to open camera:", error);
      return null;
    }
  };

  return {
    pickFromLibrary,
    takePhoto,
  };
};
