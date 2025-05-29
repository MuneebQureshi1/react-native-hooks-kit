/** InAppPurchases/useInAppPurchase.ts
 Library: https://github.com/react-native-iap/react-native-iap/blob/main/docs/IAP.md
 Docs: https://docs.google.com/document/d/1l-3NVQzTDdt2zDuegNOIrbONBtHXy2e0o46rQd6lOmQ/edit?tab=t.0
 */

import { useCallback, useState } from "react";
import {
  initConnection,
  getProducts,
  requestSubscription,
  getSubscriptions,
  getAvailablePurchases,
  clearTransactionIOS,
} from "react-native-iap";
import { Platform } from "react-native";

interface PurchaseResult {
  detail?: any;
  error?: any;
  success: boolean;
}

export const useInAppPurchase = () => {
  const [loading, setLoading] = useState(false);

  const makeConnection = useCallback(async (productId: string) => {
    await initConnection();
    await getProducts({ skus: [productId] });

    if (Platform.OS === "ios") {
      const availablePurchases = await getAvailablePurchases();
      if (availablePurchases.length > 0) {
        await clearTransactionIOS();
      }
    }
  }, []);

  const handlePurchase = useCallback(
    async (productId: string): Promise<PurchaseResult> => {
      try {
        setLoading(true);
        await makeConnection(productId);

        const subscriptions = await getSubscriptions({ skus: [productId] });
        const offerToken =
          Platform.OS === "android"
            ? subscriptions?.[0]?.subscriptionOfferDetails?.[0]?.offerToken
            : undefined;

        const subscriptionPayload: any = {
          sku: productId,
        };

        if (Platform.OS === "android" && offerToken) {
          subscriptionPayload.subscriptionOffers = [
            {
              sku: productId,
              offerToken,
            },
          ];
        }

        const result = await requestSubscription(subscriptionPayload);

        return {
          detail: result,
          success: true,
        };
      } catch (error: any) {
        return {
          error,
          success: false,
        };
      } finally {
        setLoading(false);
      }
    },
    [makeConnection]
  );

  return {
    loading,
    handlePurchase,
  };
};
