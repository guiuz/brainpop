import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { theme } from '../src/theme';
import { Button } from '../src/components/Button';
import { useRouter } from 'expo-router';
import { Brain, Trophy, Flame } from 'lucide-react-native';
import { useUserStore } from '../src/store/useUserStore';

const SLIDES = [
  {
    title: 'Desafie sua mente',
    description: 'Centenas de perguntas em diversas categorias com tempo limite e combos eletrizantes.',
    icon: Brain,
    color: theme.colors.brand.cyan,
  },
  {
    title: 'Modos Competitivos',
    description: 'Enfrente bots desafiadores em duelos 1v1 ou teste seus conhecimentos no modo Sobrevivência.',
    icon: Trophy,
    color: theme.colors.warning.orange,
  },
  {
    title: 'Evolua e Conquiste',
    description: 'Suba de nível, desbloqueie títulos exclusivos e dispute as melhores posições no ranking semanal.',
    icon: Flame,
    color: theme.colors.brand.magenta,
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useUserStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setHasCompletedOnboarding(true);
      router.replace('/permissions');
    }
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    router.replace('/permissions');
  };

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: slide.color + '20' }]}>
           <Icon color={slide.color} size={120} strokeWidth={2} />
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>

        <View style={styles.pagination}>
          {SLIDES.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                currentSlide === i && { backgroundColor: theme.colors.brand.magenta, width: 24 }
              ]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title={currentSlide === SLIDES.length - 1 ? "COMEÇAR AGORA" : "PRÓXIMO"} 
          onPress={handleNext}
        />
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
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
    paddingHorizontal: theme.spacing['2xl'],
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing['4xl'],
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    marginTop: theme.spacing['4xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border.strong,
  },
  footer: {
    padding: theme.spacing['2xl'],
    gap: theme.spacing.lg,
  },
  skipText: {
    textAlign: 'center',
    color: theme.colors.text.muted,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
