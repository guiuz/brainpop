import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '../src/theme';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black 
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Brain } from 'lucide-react-native';
import { adMobService } from '../src/services/adMobService';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {});

const GlobalBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <ImageBackground 
      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFiGBFCQjs3-_TNritCCPsnGHHR7Uom_ZDZkHD1R8EBdu0-C52gfQZfgniZ9RnTlpnPetzu8JYessnQ1EFUkPxvXgLM3l54J1nHWLZBaEB4bKz_pJq-ybnAs9Uvkr02A5r8jshs022v0DmghJBQTYF82ysEElh8AC4Ark2EbdQgzV01VMyoYQUwH8CuXYJB15gnv-UB7JlQzBvE9UmCJYfOCCsSx6UIZLbFIEfmDaI1RiCCJEZWniHZdi3wcLzZkYSBPnGCSUrBmo4' }}
      style={StyleSheet.absoluteFill}
      imageStyle={{ opacity: 0.4 }}
    />
    <Brain size={80} color={theme.colors.brand.magenta} style={[styles.confetti, { top: '5%', left: '5%', opacity: 0.12, transform: [{ rotate: '-15deg' }] }]} />
    <Brain size={80} color={theme.colors.brand.cyan} style={[styles.confetti, { top: '15%', right: '5%', opacity: 0.1, transform: [{ rotate: '20deg' }] }]} />
    <Brain size={80} color={theme.colors.brand.magenta} style={[styles.confetti, { top: '45%', left: '-10%', opacity: 0.08, transform: [{ rotate: '5deg' }] }]} />
    <Brain size={80} color={theme.colors.brand.cyan} style={[styles.confetti, { top: '55%', right: '-5%', opacity: 0.08, transform: [{ rotate: '-10deg' }] }]} />
    <Brain size={80} color={theme.colors.brand.cyan} style={[styles.confetti, { bottom: '15%', left: '10%', opacity: 0.12, transform: [{ rotate: '30deg' }] }]} />
    <Brain size={80} color={theme.colors.brand.magenta} style={[styles.confetti, { bottom: '5%', right: '10%', opacity: 0.1, transform: [{ rotate: '-20deg' }] }]} />
  </View>
);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  useEffect(() => {
    adMobService.initialize().catch((err) => {
      console.warn('AdMob initialize warning:', err);
    });
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <GlobalBackground />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="permissions" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="home" options={{ animation: 'fade' }} />
        <Stack.Screen name="modes" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="categories" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="difficulty" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="quiz" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="result" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="matchmaking" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="daily-challenge" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tournaments" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="leaderboard" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="shop" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="buy-coins" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="friends" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="help" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="privacy" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="loading" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </GestureHandlerRootView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
  }
});
