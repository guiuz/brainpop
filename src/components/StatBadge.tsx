import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { Heart, Flame, Coins, Zap } from 'lucide-react-native';

export type StatBadgeType = 'lives' | 'streak' | 'coins' | 'xp';

interface StatBadgeProps {
  type: StatBadgeType;
  value: number | string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ type, value, onPress, style }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'lives':
        return {
          icon: Heart,
          iconColor: '#EF4444',
          bgColor: '#FEE2E2',
          textColor: '#DC2626',
        };
      case 'streak':
        return {
          icon: Flame,
          iconColor: '#F97316',
          bgColor: '#FFEDD5',
          textColor: '#EA580C',
        };
      case 'coins':
        return {
          icon: Coins,
          iconColor: '#F59E0B',
          bgColor: '#FEF3C7',
          textColor: '#D97706',
        };
      case 'xp':
        return {
          icon: Zap,
          iconColor: '#8B5CF6',
          bgColor: '#EDE9FE',
          textColor: '#7C3AED',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const content = (
    <View style={[styles.container, { backgroundColor: config.bgColor }, style]}>
      <Icon size={16} color={config.iconColor} fill={config.iconColor} style={styles.icon} />
      <Text style={[styles.text, { color: config.textColor }]}>{value}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radius.full,
    minHeight: 28,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.bodySm,
    lineHeight: 18,
  },
});
