/**
 * 📱 useBiometricAuth Hook (React Native + Expo)
 * 
 * ✅ Features:
 * - Detects supported biometric types (fingerprint, face, iris)
 * - Provides separate authentication functions for each type
 * - Returns:
 *   - supportedTypes: list of available biometric methods
 *   - isAuthenticated: result of the last auth attempt
 * 
 * 🧠 How It Works:
 * - On mount, it checks for biometric hardware and enrolled biometrics
 * - Then maps the available methods to friendly names ('fingerprint', 'face', 'iris')
 * 
 * 📦 Requirements:
 * - expo-local-authentication (built-in with Expo Go)
 * 
 * 🧪 Usage Example:
 * 
 * import { useBiometricAuth } from './useBiometricAuth';
 * 
 * const {
 *   authenticateWithFingerprint,
 *   authenticateWithFace,
 *   authenticateWithIris,
 *   supportedTypes,
 *   isAuthenticated,
 * } = useBiometricAuth();
 * 
 * useEffect(() => {
 *   if (supportedTypes.includes('fingerprint')) {
 *     authenticateWithFingerprint();
 *   }
 * }, [supportedTypes]);
 */




import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';

export type BiometricType = 'fingerprint' | 'face' | 'iris';

export const useBiometricAuth = () => {
  const [supportedTypes, setSupportedTypes] = useState<BiometricType[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch supported biometric types
  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const mapped = types.map((type) => {
          switch (type) {
            case LocalAuthentication.AuthenticationType.FINGERPRINT:
              return 'fingerprint';
            case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
              return 'face';
            case LocalAuthentication.AuthenticationType.IRIS:
              return 'iris';
            default:
              return null;
          }
        }).filter(Boolean) as BiometricType[];

        setSupportedTypes(mapped);
      }
    })();
  }, []);

  const authenticateWithFingerprint = async (): Promise<boolean> => {
    if (!supportedTypes.includes('fingerprint')) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with fingerprint',
      disableDeviceFallback: false,
    });

    setIsAuthenticated(result.success);
    return result.success;
  };

  const authenticateWithFace = async (): Promise<boolean> => {
    if (!supportedTypes.includes('face')) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Face ID',
      disableDeviceFallback: false,
    });

    setIsAuthenticated(result.success);
    return result.success;
  };

  const authenticateWithIris = async (): Promise<boolean> => {
    if (!supportedTypes.includes('iris')) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with iris scan',
      disableDeviceFallback: false,
    });

    setIsAuthenticated(result.success);
    return result.success;
  };

  return {
    authenticateWithFingerprint,
    authenticateWithFace,
    authenticateWithIris,
    supportedTypes,
    isAuthenticated,
  };
};
