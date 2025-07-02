/**
 * useKeyboard Hook
 *
 * This custom React hook listens for keyboard events and provides:
 *  - `keyboardVisible`: boolean indicating if the keyboard is currently visible.
 *  - `keyboardHeight`: height of the keyboard in pixels (useful for adjusting UI).
 *
 * Platform-specific handling:
 *  - iOS: listens to `keyboardWillShow` / `keyboardWillHide`
 *  - Android: listens to `keyboardDidShow` / `keyboardDidHide`
 *
 * Usage:
 * const { keyboardVisible, keyboardHeight } = useKeyboard();
 */

import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";

export const useKeyboard = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onKeyboardDidShow = (e: KeyboardEvent) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    };

    const onKeyboardDidHide = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showSub = Platform.OS === 'ios'
      ? Keyboard.addListener("keyboardWillShow", onKeyboardDidShow)
      : Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);

    const hideSub = Platform.OS === 'ios'
      ? Keyboard.addListener("keyboardWillHide", onKeyboardDidHide)
      : Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { keyboardVisible, keyboardHeight };
};
