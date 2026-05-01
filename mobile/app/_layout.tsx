import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../store/authStore';
import LoadingOverlay from '../components/LoadingOverlay';

SplashScreen.preventAutoHideAsync();

function AuthGuard() {
  const { token, isLoading, loadAuth } = useAuthStore();
  const segments = useSegments();
  const router   = useRouter();

  // Load token from SecureStore on mount
  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (isLoading) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments, router]);

  if (isLoading) return <LoadingOverlay />;

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthGuard />
    </SafeAreaProvider>
  );
}
