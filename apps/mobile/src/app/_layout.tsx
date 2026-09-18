// @ts-nocheck
import { useAuth } from '@/utils/auth/useAuth';
import { AuthModal } from '@/utils/auth/useAuthModal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from '@/utils/themeStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate } = useAuth();
  const loadTheme = useTheme((state) => state.loadTheme);

  useEffect(() => {
    const setup = async () => {
      await initiate();
      await loadTheme();
      // Hide splash after a brief delay to ensure everything is loaded
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100);
    };
    setup();
  }, [initiate, loadTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="run" />
          <Stack.Screen name="run-complete" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="trophies" />
          <Stack.Screen name="user/[id]" />
        </Stack>
        <AuthModal />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
