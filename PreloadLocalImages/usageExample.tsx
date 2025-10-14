/**
 * Usage Example for usePreloadImages Hook
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { usePreloadImages } from './usePreloadImages';

const ImageUrls = {
  banner: require('../assets/banner.avif'),
  // logo: require('../assets/logo.png'),
};

const PreloadImagesExample = () => {
  const { isLoaded } = usePreloadImages(ImageUrls);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading images...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Images Loaded!</Text>
    </View>
  );
};

export default PreloadImagesExample;

