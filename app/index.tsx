import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator
} from 'react-native';
import { theme } from '../src/theme';
import { useRouter } from 'expo-router';
import { useUserStore } from '../src/store/useUserStore';
import { firebaseAuthService } from '../src/services/firebaseAuthService';
import { auth } from '../src/services/firebase';
import { resolveInitialRoute } from '../src/utils/navigationFlow';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoggedIn, id: storedUserId, syncFromCloud, checkDailyStreak } = useUserStore();

  useEffect(() => {
    let isMounted = true;

    const checkSessionAndRedirect = async () => {
      // Delay de 1.2s para exibir a logo de abertura
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (!isMounted) return;

      let hasValidSession = false;

      try {
        const currentFbUser = auth?.currentUser;

        // Se houver um usuário autenticado no Firebase ou ID salvo no Zustand
        if (currentFbUser?.uid || (isLoggedIn && storedUserId)) {
          const uidToFetch = currentFbUser?.uid || storedUserId;
          const cloudProfile = await firebaseAuthService.getUserProfileById(uidToFetch);

          if (cloudProfile && isMounted) {
            syncFromCloud(cloudProfile);
            checkDailyStreak();
            hasValidSession = true;
          }
        }

        if (!hasValidSession && isMounted) {
          useUserStore.getState().logout();
        }
      } catch (e) {
        console.warn('Splash session check error:', e);
        if (isMounted) {
          useUserStore.getState().logout();
        }
      } finally {
        if (isMounted) {
          const currentStore = useUserStore.getState();
          const targetRoute = resolveInitialRoute({
            hasCompletedOnboarding: currentStore.hasCompletedOnboarding,
            hasConfiguredInitialPermissions: currentStore.hasConfiguredInitialPermissions,
            hasValidSession,
          });
          router.replace(targetRoute);
        }
      }
    };

    checkSessionAndRedirect();

    return () => {
      isMounted = false;
    };
    // Executa a verificação de sessão estritamente uma única vez na inicialização (splash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../Logo/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoTextMain}>BRAIN</Text>
          <Text style={styles.logoTextSub}>POP</Text>
        </View>
        <ActivityIndicator size="large" color={theme.colors.brand.magenta} style={styles.loader} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.app,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: theme.spacing.md,
  },
  logoTextMain: {
    fontFamily: 'Inter_900Black',
    fontSize: theme.typography.sizes.displayXl,
    color: theme.colors.brand.cyan,
  },
  logoTextSub: {
    fontFamily: 'Inter_900Black',
    fontSize: theme.typography.sizes.displayXl,
    color: theme.colors.brand.cyan,
    marginTop: -theme.spacing.sm,
  },
  loader: {
    marginTop: theme.spacing['4xl'],
  },
});
