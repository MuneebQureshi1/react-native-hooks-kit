import React from 'react';
import { View, Button, ActivityIndicator, Text } from 'react-native';
import { useInAppPurchase } from './useInAppPurchase';

const SubscriptionScreen = () => {
  const { handlePurchase, loading } = useInAppPurchase();

  const onSubscribe = async () => {
    const response = await handlePurchase('your_product_id');
    if (response.success) {
      console.log('Purchase successful:', response.detail);
    } else {
      console.log('Purchase failed:', response.error);
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Subscribe" onPress={onSubscribe} />
      )}
    </View>
  );
};

export default SubscriptionScreen;
