/**
 * @fileoverview Responsive design utilities
 * @description This file contains the responsive design utilities for the app
 * @author Muneeb Qureshi
 */

import { Dimensions, Platform } from "react-native";

export const width = Math.round(Dimensions.get("window").width);
export const height = Math.round(Dimensions.get("window").height);

//Guideline sizes are based on standard ~5" screen mobile devices
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800 + 40;

export const scale = (size: any) => (width / guidelineBaseWidth) * size;

export const vs = (size: any) => (height / guidelineBaseHeight) * size;

export const ms = (size: any, factor: any = 0.5) => size + (scale(size) - size) * factor;

export const mvs = (size: number, factor: number = Platform.OS === "android" ? 0.7 : 0.5) => {
  const result = size + (vs(size) - size) * factor;
  return Math.round(result * 100) / 100;
};

// ✅ Font scaling
export const fontScale = (size: number) => {
  const scaleFactor = width / guidelineBaseWidth;
  // Different adjusted factor for iOS vs Android
  const adjustedFactor = Platform.OS === "ios" ? 0.92 : 0.85;
  const scaled = size * scaleFactor * adjustedFactor;
  return Math.round(scaled);
};