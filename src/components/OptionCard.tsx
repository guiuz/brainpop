import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { Check, X } from 'lucide-react-native';

export type OptionStatus = 'default' | 'selected' | 'correct' | 'wrong' | 'disabled';

interface OptionCardProps {
  label: string; // Ex: "A", "B", "C", "D"
  text: string;
  status?: OptionStatus;
  onPress: () => void;
  style?: ViewStyle;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  text,
  status = 'default',
  onPress,
  style,
}) => {
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';
  const isSelected = status === 'selected';
  const isDisabled = status === 'disabled';

  const getContainerStyle = () => {
    if (isCorrect) return styles.containerCorrect;
    if (isWrong) return styles.containerWrong;
    if (isSelected) return styles.containerSelected;
    if (isDisabled) return styles.containerDisabled;
    return styles.containerDefault;
  };

  const getBadgeStyle = () => {
    if (isCorrect) return styles.badgeCorrect;
    if (isWrong) return styles.badgeWrong;
    if (isSelected) return styles.badgeSelected;
    return styles.badgeDefault;
  };

  const getTextStyle = () => {
    if (isCorrect) return styles.textCorrect;
    if (isWrong) return styles.textWrong;
    if (isSelected) return styles.textSelected;
    if (isDisabled) return styles.textDisabled;
    return styles.textDefault;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled || isCorrect || isWrong}
      style={[styles.baseContainer, getContainerStyle(), style]}
    >
      <View style={[styles.badge, getBadgeStyle()]}>
        {isCorrect ? (
          <Check size={18} color="#FFF" strokeWidth={3} />
        ) : isWrong ? (
          <X size={18} color="#FFF" strokeWidth={3} />
        ) : (
          <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>{label}</Text>
        )}
      </View>

      <Text style={[styles.optionText, getTextStyle()]} numberOfLines={3}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    marginBottom: theme.spacing.md,
    ...theme.shadows.pillowy,
  },
  containerDefault: {
    backgroundColor: theme.colors.bg.surface,
    borderColor: theme.colors.border.soft,
  },
  containerSelected: {
    backgroundColor: '#FDF2F8',
    borderColor: theme.colors.brand.magenta,
  },
  containerCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: theme.colors.success.green,
  },
  containerWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: theme.colors.danger.red,
  },
  containerDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.4,
    elevation: 0,
    shadowOpacity: 0,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  badgeDefault: {
    backgroundColor: theme.colors.bg.soft,
  },
  badgeSelected: {
    backgroundColor: theme.colors.brand.magenta,
  },
  badgeCorrect: {
    backgroundColor: theme.colors.success.green,
  },
  badgeWrong: {
    backgroundColor: theme.colors.danger.red,
  },
  badgeText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.body,
  },
  badgeTextSelected: {
    color: '#FFF',
  },
  optionText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.sizes.body,
    lineHeight: 22,
  },
  textDefault: {
    color: theme.colors.text.primary,
  },
  textSelected: {
    color: theme.colors.brand.magenta,
    fontFamily: theme.typography.fontFamily.bold,
  },
  textCorrect: {
    color: theme.colors.success.greenDark,
    fontFamily: theme.typography.fontFamily.bold,
  },
  textWrong: {
    color: theme.colors.danger.red,
    fontFamily: theme.typography.fontFamily.bold,
  },
  textDisabled: {
    color: theme.colors.text.muted,
  },
});
