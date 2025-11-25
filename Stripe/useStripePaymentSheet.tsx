/**
 * useStripePaymentSheet.tsx
 *
 * This hook is used to handle the payment sheet using Stripe.
 * It is useful when you need to handle the payment sheet.
 *
 * @param options - The options for the payment sheet.
 * @returns {Object} - An object containing the openPaymentSheet and loading functions.
 * @param createPaymentIntent - The function to create the payment intent.
 * @param merchantDisplayName - The merchant display name.
 * @param returnURL - The return URL.
 * @param allowsDelayedPaymentMethods - Whether to allow delayed payment methods.
 * @param appearance - The appearance for the payment sheet.
 * @param defaultErrorMessage - The default error message.
 * @returns {Object} - An object containing the openPaymentSheet and loading functions.
 * wrap the parent component with  <StripeProvider publishableKey={publishableKey}>.
 * publishableKey is the publishable key for the Stripe account.
 */

import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import type { PaymentSheet } from "@stripe/stripe-react-native";

type StripeColors = {
  primary?: string;
  background?: string;
  componentBackground?: string;
  componentBorder?: string;
  componentDivider?: string;
  primaryText?: string;
  secondaryText?: string;
  componentText?: string;
  placeholderText?: string;
  icon?: string;
  error?: string;
};

type StripeShapes = {
  borderRadius?: number;
  shadow?: {
    color?: string;
    opacity?: number;
    offset?: { x: number; y: number };
  };
};

type StripeAppearance = {
  colors?: StripeColors;
  shapes?: StripeShapes;
};

type CreatePaymentIntentResponse = {
  client_secret: string;
  customer?: string;
  [key: string]: any;
};

type UseStripePaymentSheetOptions = {
  /**
   * Function to create payment intent on your backend
   * Should return an object with client_secret and optionally customer
   */
  createPaymentIntent: (data?: any) => Promise<CreatePaymentIntentResponse>;
  
  /**
   * Merchant display name shown in the payment sheet
   */
  merchantDisplayName: string;
  
  /**
   * Return URL for payment completion
   */
  returnURL?: string;
  
  /**
   * Whether to allow delayed payment methods
   */
  allowsDelayedPaymentMethods?: boolean;
  
  /**
   * Custom appearance configuration for the payment sheet
   */
  appearance?: StripeAppearance;
  
  /**
   * Default error message if payment fails
   */
  defaultErrorMessage?: string;
};

type OpenPaymentSheetOptions = {
  /**
   * Data to pass to createPaymentIntent function
   */
  paymentData?: any;
  
  /**
   * Callback when payment succeeds
   */
  onSuccess?: () => void;
  
  /**
   * Callback when payment fails
   */
  onFailure?: (error: string) => void;
};

export function useStripePaymentSheet(options: UseStripePaymentSheetOptions) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const {
    createPaymentIntent,
    merchantDisplayName,
    returnURL,
    allowsDelayedPaymentMethods = true,
    appearance,
    defaultErrorMessage = "Payment failed. Please try again.",
  } = options;

  const openPaymentSheet = async ({
    paymentData,
    onSuccess,
    onFailure,
  }: OpenPaymentSheetOptions) => {
    try {
      setLoading(true);

      // 1. Call backend to create PaymentIntent
      const response = await createPaymentIntent(paymentData);
      const paymentIntent = response?.client_secret;
      const customerId = response?.customer;

      if (!paymentIntent) {
        throw new Error("No paymentIntent returned from server");
      }

      // 2. Init payment sheet with custom appearance
      const initOptions: PaymentSheet.InitParams = {
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName,
        allowsDelayedPaymentMethods,
        ...(customerId && { customerId }),
        ...(returnURL && { returnURL }),
        ...(appearance && { appearance }),
      };

      const { error: initError } = await initPaymentSheet(initOptions);

      if (initError) throw initError;

      // 3. Present sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        onFailure?.(paymentError.message);
      } else {
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        defaultErrorMessage;
      onFailure?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { openPaymentSheet, loading };
}
