import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { theme } from '../src/theme';
import { useRouter } from 'expo-router';
import { Brain } from 'lucide-react-native';

export default function LoadingPartidaScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/quiz');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
           <Brain color={theme.colors.brand.cyan} size={80} />
        </View>
        <Text style={styles.title}>Preparando perguntas...</Text>
        <Text style={styles.subtitle}>Aquecendo os neurônios</Text>
        <ActivityIndicator 
          size="large" 
          color={theme.colors.brand.magenta} 
          style={styles.loader} 
        />
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
    marginBottom: theme.spacing['2xl'],
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.muted,
    marginTop: 8,
  },
  loader: {
    marginTop: theme.spacing['4xl'],
  },
});
