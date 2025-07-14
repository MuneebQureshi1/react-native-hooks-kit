/**
 * 🔔 useFCM Hook - Handles Firebase Cloud Messaging (FCM) setup for push notifications.
 * 
 * 📚 Setup Guide:
 * - React Native Firebase Messaging Docs: https://rnfirebase.io/messaging/usage
 * - Firebase Project Setup: https://firebase.google.com/docs/android/setup
 * - iOS Push Notifications Setup: https://rnfirebase.io/messaging/ios-device-notifications
 * 
 * ✅ Make sure:
 * - FCM is enabled in your Firebase Console.
 * - The app has proper permissions (especially for iOS).
 * - You’ve configured the Firebase credentials (`google-services.json` for Android, `GoogleService-Info.plist` for iOS).
 */
import messaging from "@react-native-firebase/messaging";
import { useCallback, useEffect } from "react";
import { Alert } from "react-native";

export const useFCM = () => {
  useEffect(() => {
    // 📲 Request user permission before getting token
    requestUserPermission();

    // 🔐 Request and log the FCM token (used to send notifications to this device)
    getFcmToken();

    // 📩 Listener for messages received while the app is in the foreground
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log("📩 FCM Foreground:", remoteMessage);
        Alert.alert(
          remoteMessage.notification?.title || "Notification",
          remoteMessage.notification?.body || ""
        );
      }
    );

    // 🔙 Triggered when user taps a notification and the app is in background
    const unsubscribeFromOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log("🔙 Opened from background:", remoteMessage);
        // Handle navigation or logic here
      }
    );

    // 🚀 Called when app is opened by tapping a notification while it was fully closed (quit state)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("🚀 Opened from quit state:", remoteMessage);
          // Handle navigation or logic here
        }
      });

    // 📦 Set handler for messages received in background (Android only)
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("📦 Background Message:", remoteMessage);
      // Optionally store or process data
    });

    // 🧹 Clean up listeners on unmount
    return () => {
      unsubscribeOnMessage();
      unsubscribeFromOpened();
    };
  }, []);

  // 📲 Request permission to receive notifications (especially for iOS)
  const requestUserPermission = useCallback(async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("✅ Notification permission granted:", authStatus);
    } else {
      console.log("❌ Notification permission denied:", authStatus);
    }

    // Optional: You could show a custom permission alert here if denied
  }, []);

  // 🔁 Get and optionally store/send FCM token to your backend
  const getFcmToken = useCallback(async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log("🔥 FCM Token:", token);
        return token;
        // Send to backend if needed
      }
    } catch (error) {
      console.log("⚠️ Error fetching FCM token:", error);
    }
  }, []);

  return {
    getFcmToken,
    requestUserPermission,
  };
};
