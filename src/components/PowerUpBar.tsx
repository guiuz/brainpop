import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { Sparkles, Clock, FastForward, Lightbulb } from 'lucide-react-native';
import { PowerUpType, useGameStore } from '../store/useGameStore';
import { useUserStore } from '../store/useUserStore';

interface PowerUpBarProps {
  style?: ViewStyle;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({ style }) => {
  const { usedPowerUps, usePowerUp: applyPowerUp, isAnswerSubmitted, isTimeout } = useGameStore();
  const { inventory, consumePowerUpItem } = useUserStore();

  const isBarDisabled = isAnswerSubmitted || isTimeout;

  const handleUsePowerUp = (type: PowerUpType) => {
    if (isBarDisabled || usedPowerUps[type]) return;
    
    // Se o jogador tiver o item no inventário
    if (inventory[type] > 0) {
      const success = applyPowerUp(type);
      if (success) {
        consumePowerUpItem(type);
      }
    }
  };

  const POWER_UPS = [
    {
      id: 'fiftyFifty' as PowerUpType,
      title: '50/50',
      icon: Sparkles,
      color: theme.colors.brand.purple,
    },
    {
      id: 'extraTime' as PowerUpType,
      title: '+15s',
      icon: Clock,
      color: theme.colors.info.teal,
    },
    {
      id: 'skip' as PowerUpType,
      title: 'Pular',
      icon: FastForward,
      color: theme.colors.warning.orange,
    },
    {
      id: 'hint' as PowerUpType,
      title: 'Dica',
      icon: Lightbulb,
      color: theme.colors.warning.amber,
    },
  ];

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.headerLabel}>PODERES — toque para usar</Text>
      <View style={styles.container}>
        {POWER_UPS.map((item) => {
          const Icon = item.icon;
          const count = inventory[item.id] || 0;
          const isUsed = usedPowerUps[item.id];
          const isDisabled = isBarDisabled || isUsed || count <= 0;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              disabled={isDisabled}
              onPress={() => handleUsePowerUp(item.id)}
              style={[
                styles.button,
                isDisabled && styles.buttonDisabled,
                isUsed && styles.buttonUsed,
              ]}
              accessibilityLabel={`${item.title} (${count} disponíveis)`}
            >
              <View style={[styles.iconWrapper, { backgroundColor: item.color + '20' }]}>
                <Icon size={18} color={isDisabled ? theme.colors.text.muted : item.color} />
              </View>
              <Text style={[styles.title, isDisabled && styles.textDisabled]}>{item.title}</Text>
              <View style={[styles.badgeCount, isDisabled && styles.badgeCountDisabled]}>
                <Text style={styles.badgeText}>{isUsed ? '✓' : count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
  headerLabel: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.bg.surface,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.xl,
    ...theme.shadows.card,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 48,
    minHeight: 48,
    paddingHorizontal: 4,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonUsed: {
    opacity: 0.35,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    color: theme.colors.text.body,
  },
  textDisabled: {
    color: theme.colors.text.muted,
  },
  badgeCount: {
    position: 'absolute',
    top: 0,
    right: 2,
    backgroundColor: theme.colors.brand.magenta,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCountDisabled: {
    backgroundColor: theme.colors.text.muted,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.black,
  },
});
