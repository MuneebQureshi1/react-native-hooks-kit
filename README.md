<img src="./assets/banner.avif" alt="Custom Hooks Banner" style="width: 100%;" />

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" style="height:28px; vertical-align: middle;" />
  <img src="https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" style="height:28px; vertical-align: middle;" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" style="height:28px; vertical-align: middle;" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" style="height:28px; vertical-align: middle;" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" style="height:28px; vertical-align: middle;" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" style="height:28px; vertical-align: middle;" />
</p>


# 🪝 Custom React & React Native Hooks

This repository contains a collection of reusable and modular **custom hooks** built for both React and React Native applications. These hooks abstract common functionality to help you write cleaner and more maintainable code.

---

## 📁 Available Hooks

### 🔄 **ApiCalling/**
A reusable hook for performing API calls with Axios. Centralizes logic for loading, error handling, and responses.

### 🔙 **DisableAndroidBackButton/**
Hook to disable or customize the Android back button behavior — useful in authentication flows, modal screens, or splash screens.

### ⚠️ **ForceUpdate/**
Checks app version using `react-native-version-check`. Can force users to update if they are on an older version.

### 🙈 **HideTabBar/**
Allows hiding the bottom tab bar dynamically in specific screens using React Navigation.

### 🖼 **ImagePickerInExpo/**
Hook built using `expo-image-picker` to allow image selection from camera or gallery.

### 💳 **InAppPurchases/**
Handles in-app subscriptions or one-time purchases using `react-native-iap`.

### 🔐 **IntercepterWithoutRefreshToken/**
Axios interceptor to attach authorization headers and handle request/response logic **without token refreshing**.

### ♻️ **IntercepterWithRefreshToken/**
Axios interceptor that includes **refresh token logic**. Automatically retries requests after refreshing expired access tokens.

### 🌐 **InternetStatus/**
A hook that tracks internet connectivity using `@react-native-community/netinfo`. Provides `isConnected` and `isInternetReachable` flags.

### ⌨️ **KeyboardVisibilityCheck/**
Tracks keyboard visibility and height. Useful for dynamically adjusting UI based on keyboard presence.

### 📱 **ResponsivenessWithLibrary/**
Implements responsiveness using libraries like `react-native-responsive-screen`.

### 📐 **ResponsivenessWithoutLibrary/**
Responsive layout without using any third-party library. Based on `Dimensions` and percentage-based calculations.

### 🔐 **SocailAuths/**
Hook for managing social logins such as Google, Facebook, or Apple (depending on platform and libraries used).

---

## ✅ Contributing

We welcome contributions to this custom hooks repository! If you have a useful hook or improvements to existing ones, feel free to open a pull request or submit an issue.

Please follow these guidelines when contributing:

- ✅ Use **TypeScript** for type safety and consistency.
- ✅ Include a **brief comment or usage example** for clarity.
- ✅ Keep the code **clean, modular, and reusable**.
- ✅ Ensure hooks are placed in logically named files (e.g., `useYourHookName.ts`).
- ✅ If possible, write a simple test or usage scenario.

---

## 🎉 Happy Coding!

Thank you for checking out this repository! We hope these hooks save you time and help keep your codebase clean and maintainable.

If you find this useful, consider giving it a ⭐️ and feel free to share it with others.

Keep building. Keep learning.  
**Happy Coding! 💻🚀**

Let’s build a solid collection of reusable logic together! 🚀
