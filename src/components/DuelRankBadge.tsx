import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Crown, Award, Sparkles } from 'lucide-react-native';
import { DuelRank } from '../data/duelRanks';

interface DuelRankBadgeProps {
  rank: DuelRank;
  size?: 'sm' | 'md' | 'lg';
  showTag?: boolean;
  style?: ViewStyle;
}

export const DuelRankBadge: React.FC<DuelRankBadgeProps> = ({
  rank,
  size = 'md',
  showTag = true,
  style,
}) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const badgeSize = isLarge ? 88 : isSmall ? 40 : 64;
  const iconSize = isLarge ? 38 : isSmall ? 18 : 28;

  const getTierIcon = () => {
    switch (rank.tier) {
      case 'Desafiante':
        return <Crown size={iconSize} color="#FFF" />;
      case 'Grão-Mestre':
      case 'Mestre':
        return <Award size={iconSize} color="#FFF" />;
      case 'Diamante':
      case 'Platina':
        return <Sparkles size={iconSize} color="#FFF" />;
      default:
        return <Shield size={iconSize} color="#FFF" />;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Outer Glow Shield */}
      <View style={[
        styles.glowWrapper,
        {
          width: badgeSize + (isLarge ? 16 : isSmall ? 8 : 12),
          height: badgeSize + (isLarge ? 16 : isSmall ? 8 : 12),
          borderRadius: (badgeSize + 16) / 2,
          backgroundColor: rank.glowColor,
        }
      ]}>
        {/* Core Shield / Badge */}
        <LinearGradient
          colors={rank.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.badgeCore,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              borderColor: rank.primaryColor,
            }
          ]}
        >
          {getTierIcon()}
          {rank.division && !isSmall && (
            <View style={[styles.divisionPill, { backgroundColor: rank.primaryColor }]}>
              <Text style={styles.divisionText}>{rank.division}</Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Rank Name & Tag */}
      {!isSmall && (
        <View style={styles.textContainer}>
          <Text style={[styles.rankName, isLarge && styles.rankNameLg, { color: rank.primaryColor }]}>
            {rank.name.toUpperCase()}
          </Text>
          {showTag && (
            <Text style={[styles.rankTag, isLarge && styles.rankTagLg]}>
              {rank.tag}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCore: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  divisionPill: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  divisionText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  rankName: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  rankNameLg: {
    fontSize: 18,
    letterSpacing: 1,
  },
  rankTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  rankTagLg: {
    fontSize: 13,
  },
});
