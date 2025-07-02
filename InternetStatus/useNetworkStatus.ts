/**
 * useNetworkStatus Hook
 *
 * Monitors internet connectivity status.
 * Returns:
 * - isConnected: boolean — true if the device is connected to the internet
 * - isInternetReachable: boolean | null — indicates if the internet is reachable
 *
 * Usage:
 * const { isConnected, isInternetReachable } = useNetworkStatus();
 */

import { useEffect, useState } from "react";
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe: NetInfoSubscription = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, isInternetReachable };
};
