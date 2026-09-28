import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { ArrowLeft, X, Settings } from 'lucide-react-native';
import { StatBadge } from './StatBadge';
import { useUserStore } from '../store/useUserStore';

interface HeaderBarProps {
  showBack?: boolean;
  showClose?: boolean;
  onBackPress?: () => void;
  showStats?: boolean;
  showSettings?: boolean;
  style?: ViewStyle;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  showBack = false,
  showClose = false,
  onBackPress,
  showStats = true,
  showSettings = false,
  style,
}) => {
  const router = useRouter();
  const { lives, dailyStreak, coins } = useUserStore();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
        {showClose && (
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <X size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      {showStats && (
        <View style={styles.statsSection}>
          <StatBadge 
            type="lives" 
            value={lives} 
            onPress={() => router.push('/shop' as any)} 
          />
          <StatBadge 
            type="streak" 
            value={dailyStreak} 
          />
          <StatBadge 
            type="coins" 
            value={coins} 
            onPress={() => router.push('/shop' as any)} 
          />
        </View>
      )}

      <View style={styles.rightSection}>
        {showSettings && (
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.7}
          >
            <Settings size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.containerMargin,
    paddingVertical: theme.spacing.sm,
    minHeight: 52,
  },
  leftSection: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  rightSection: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.pillowy,
  },
});
