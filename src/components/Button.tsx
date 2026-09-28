import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle
} from 'react-native';
import { theme } from '../theme';
import { LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'powerup';
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon: Icon,
  style,
  textStyle,
}) => {
  const isGradient = variant === 'primary' || variant === 'powerup';

  const renderContent = () => (
    loading ? (
      <ActivityIndicator color={variant === 'outline' ? theme.colors.brand.magenta : '#FFF'} />
    ) : (
      <>
        {Icon && <Icon size={24} color={variant === 'outline' ? theme.colors.success.green : '#FFF'} style={styles.icon} />}
        <Text style={[styles.baseText, getVariantTextStyles(), textStyle]}>
          {title}
        </Text>
      </>
    )
  );

  const getVariantTextStyles = () => {
    switch (variant) {
      case 'outline': return styles.outlineText;
      case 'ghost': return styles.ghostText;
      case 'primary': return styles.primaryText;
      default: return styles.baseWhiteText;
    }
  };

  if (isGradient) {
    const colors = variant === 'primary' ? theme.gradients.cta : theme.gradients.powerup;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.base, styles.baseGradient, styles.shadowGradient, style, (disabled || loading) && styles.disabled]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientFill}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      case 'ghost': return styles.ghost;
      default: return {};
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.base, getVariantStyles(), style, (disabled || loading) && styles.disabled]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius['2xl'],
    minHeight: 56,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...theme.shadows.pillowy,
  },
  baseGradient: {
    paddingHorizontal: 0,
  },
  gradientFill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 56,
  },
  shadowGradient: {
    ...theme.shadows.magentaGlow,
  },
  baseText: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 20,
    letterSpacing: 1,
  },
  baseWhiteText: {
    color: '#FFF',
  },
  outlineText: {
    color: theme.colors.success.green,
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  ghostText: {
    color: theme.colors.text.muted,
  },
  secondary: {
    backgroundColor: theme.colors.success.green,
  },
  outline: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: theme.colors.success.green,
  },
  ghost: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 10,
  },
});
