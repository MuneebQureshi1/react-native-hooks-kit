/**
 * Usage Example for useStripePaymentSheet Hook
 */

import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useStripePaymentSheet } from './useStripePaymentSheet';
import axios from 'axios'; // or your preferred HTTP client

const PaymentExample = () => {
  // Configure the hook with your backend API and settings
  const { openPaymentSheet, loading } = useStripePaymentSheet({
    // Function to create payment intent on your backend
    createPaymentIntent: async (data) => {
      // Replace with your actual API endpoint
      const response = await axios.post('https://your-api.com/create-payment-intent', {
        amount: data?.amount,
        currency: data?.currency || 'usd',
      });
      
      // Return the client_secret and optionally customer ID
      return {
        client_secret: response.data.stripe_response.client_secret,
        customer: response.data.stripe_response.customer, // optional
      };
    },
    
    // Merchant display name shown in payment sheet
    merchantDisplayName: 'My App',
    
    // Return URL for payment completion (optional)
    returnURL: 'myapp://payment-success',
    
    // Allow delayed payment methods (optional, default: true)
    allowsDelayedPaymentMethods: true,
    
    // Custom appearance (optional)
    appearance: {
      colors: {
        primary: '#007AFF', // Your app's main color
        background: '#FFFFFF',
        componentBackground: '#F5F5F5',
        componentBorder: '#E0E0E0',
        componentDivider: '#E0E0E0',
        primaryText: '#000000',
        secondaryText: '#666666',
        componentText: '#000000',
        placeholderText: '#999999',
        icon: '#000000',
        error: '#FF3B30',
      },
      shapes: {
        borderRadius: 8,
        shadow: {
          color: '#000000',
          opacity: 0.1,
          offset: { x: 0, y: 2 },
        },
      },
    },
    
    // Default error message (optional)
    defaultErrorMessage: 'Payment failed. Please try again.',
  });

  const handlePayment = async () => {
    await openPaymentSheet({
      // Data to pass to createPaymentIntent function
      paymentData: {
        amount: 5000, // $50.00 in cents
        currency: 'usd',
      },
      
      // Success callback
      onSuccess: () => {
        Alert.alert('Success', 'Payment completed successfully!');
        // Navigate to success screen, update UI, etc.
      },
      
      // Failure callback
      onFailure: (error) => {
        Alert.alert('Payment Failed', error);
        // Handle error, show error message, etc.
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stripe Payment Example</Text>
      
      <Button
        title={loading ? 'Processing...' : 'Pay Now'}
        onPress={handlePayment}
        disabled={loading}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Processing payment...</Text>
        </View>
      )}
    </View>
  );
};

// Minimal example without appearance customization
const MinimalPaymentExample = () => {
  const { openPaymentSheet, loading } = useStripePaymentSheet({
    createPaymentIntent: async (data) => {
      const response = await axios.post('/api/payment-intent', data);
      return {
        client_secret: response.data.client_secret,
      };
    },
    merchantDisplayName: 'My App',
  });

  const handlePayment = async () => {
    await openPaymentSheet({
      paymentData: { order_id: 456 },
      onSuccess: () => console.log('Payment successful!'),
      onFailure: (error) => console.error('Payment failed:', error),
    });
  };

  return (
    <View>
      <Button
        title="Pay"
        onPress={handlePayment}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default PaymentExample;

