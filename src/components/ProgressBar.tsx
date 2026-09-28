import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  gradientColors?: string[];
  trackColor?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 10,
  gradientColors = [theme.colors.brand.magenta, theme.colors.brand.magentaLight],
  trackColor = '#E2E8F0',
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height / 2 }, style]}>
      {clampedProgress > 0 && (
        <View style={[styles.fillContainer, { width: `${clampedProgress * 100}%`, borderRadius: height / 2 }]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fillContainer: {
    height: '100%',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
});
