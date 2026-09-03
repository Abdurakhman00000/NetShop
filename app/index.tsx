import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { WelcomeScreen } from '@/components/welcome/WelcomeScreen';

const DISPLAY_MS = 2500;
const FADE_MS = 420;

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/**
 * Animated welcome gate — no CTAs.
 * Shows brand atmosphere for 2.5s, then fades into main tabs.
 */
export default function WelcomeRoute() {
  const opacity = useSharedValue(1);
  const navigated = useRef(false);

  const goHome = useCallback(() => {
    if (navigated.current) return;
    navigated.current = true;
    router.replace('/(tabs)');
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: FADE_MS }, (finished) => {
        if (finished) {
          runOnJS(goHome)();
        }
      });
    }, DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [goHome, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.root, animatedStyle]}>
      <WelcomeScreen />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
