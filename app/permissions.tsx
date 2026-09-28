import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { useRouter } from 'expo-router';
import { Bell, Volume2, ShieldCheck } from 'lucide-react-native';
import { useUserStore } from '../src/store/useUserStore';

export default function PermissionsScreen() {
  const router = useRouter();
  const { updateSettings, setHasConfiguredInitialPermissions } = useUserStore();
  const [notifications, setNotifications] = React.useState(true);
  const [sound, setSound] = React.useState(true);

  const handleFinish = () => {
    updateSettings({
      notificationsEnabled: notifications,
      soundEnabled: sound,
    });
    setHasConfiguredInitialPermissions(true);
    router.replace('/login');
  };

  const handleSkip = () => {
    setHasConfiguredInitialPermissions(true);
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
           <ShieldCheck color={theme.colors.brand.magenta} size={80} />
           <Text style={styles.title}>Quase lá!</Text>
           <Text style={styles.description}>
             Para a melhor experiência, precisamos de algumas permissões.
           </Text>
        </View>

        <View style={styles.options}>
           <Card style={styles.optionCard}>
              <View style={styles.optionInfo}>
                 <View style={[styles.iconBox, { backgroundColor: theme.colors.brand.magenta + '15' }]}>
                    <Bell color={theme.colors.brand.magenta} size={24} />
                 </View>
                 <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>Notificações</Text>
                    <Text style={styles.optionDesc}>Fique por dentro de novos duelos e eventos.</Text>
                 </View>
              </View>
              <Switch 
                value={notifications} 
                onValueChange={setNotifications}
                trackColor={{ false: theme.colors.border.soft, true: theme.colors.brand.magenta }}
              />
           </Card>

           <Card style={styles.optionCard}>
              <View style={styles.optionInfo}>
                 <View style={[styles.iconBox, { backgroundColor: theme.colors.brand.purple + '15' }]}>
                    <Volume2 color={theme.colors.brand.purple} size={24} />
                 </View>
                 <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>Sons e Efeitos</Text>
                    <Text style={styles.optionDesc}>Feedback sonoro durante as partidas.</Text>
                 </View>
              </View>
              <Switch 
                value={sound} 
                onValueChange={setSound}
                trackColor={{ false: theme.colors.border.soft, true: theme.colors.brand.purple }}
              />
           </Card>
        </View>

        <View style={styles.footer}>
           <Button 
             title="CONTINUAR" 
             onPress={handleFinish} 
           />
           <TouchableOpacity onPress={handleSkip}>
             <Text style={styles.skipText}>Configurar depois</Text>
           </TouchableOpacity>
        </View>
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
    padding: theme.spacing['2xl'],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['4xl'],
  },
  title: {
    fontSize: theme.typography.sizes.displayLg,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  options: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing['4xl'],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  optionDesc: {
    fontSize: 10,
    color: theme.colors.text.muted,
  },
  footer: {
    gap: theme.spacing.lg,
  },
  skipText: {
    textAlign: 'center',
    color: theme.colors.text.muted,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
