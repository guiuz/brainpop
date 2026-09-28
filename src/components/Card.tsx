import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  variant?: 'white' | 'soft' | 'gradient-teal' | 'gradient-orange' | 'gradient-cyan';
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'white', style }) => {
  const isGradient = variant.startsWith('gradient-');
  
  const getGradientColors = () => {
    switch (variant) {
      case 'gradient-teal': return theme.gradients.statTeal;
      case 'gradient-orange': return theme.gradients.statOrange;
      case 'gradient-cyan': return theme.gradients.statCyan;
      default: return [];
    }
  };

  if (isGradient) {
    return (
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, styles.gradient, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.base, styles[variant as 'white' | 'soft'], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  white: {
    backgroundColor: theme.colors.bg.surface,
  },
  soft: {
    backgroundColor: theme.colors.bg.soft,
    elevation: 0,
    shadowOpacity: 0,
  },
  gradient: {
    ...theme.shadows.pillowy,
  },
});
