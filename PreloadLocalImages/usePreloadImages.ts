/**
 * usePreloadImages.ts
 *
 * This hook is used to preload images.
 * It is useful when you need to preload images.
 *
 * @param images - The images to preload.
 */

import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';

export function usePreloadImages(images: Record<string, number>) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function preload() {
      try {
        const imageAssets = Object.values(images).map((img) =>
          Asset.fromModule(img).downloadAsync()
        );
        await Promise.all(imageAssets);
        setIsLoaded(true);
      } catch (err: any) {
        console.log('Image preloading failed:', err);
        setIsLoaded(true);
      }
    }

    preload();
  }, [images]);

  return { isLoaded };
}
