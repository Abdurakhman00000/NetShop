import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import { Colors } from '@/constants/theme';
import { hydrateAuth } from '@/store/authSlice';
import { loadCart } from '@/store/cartSlice';
import { hydrateCity, loadCities } from '@/store/citySlice';
import { store } from '@/store';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export const unstable_settings = {
  initialRouteName: 'index',
};

function AuthBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    void (async () => {
      await store.dispatch(hydrateAuth());
      await store.dispatch(hydrateCity());
      await store.dispatch(loadCities());
      const auth = store.getState().auth;
      if (auth.status === 'authenticated') {
        void store.dispatch(loadCart());
      }
    })();
  }, []);

  return children;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <AuthBootstrap>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="product" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="service" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="orders" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="seller" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="checkout" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen
              name="search"
              options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
            />
            <Stack.Screen name="city" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </AuthBootstrap>
    </Provider>
  );
}
