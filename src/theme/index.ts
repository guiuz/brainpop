export const theme = {
  colors: {
    brand: {
      magenta: '#EC4899',
      magentaLight: '#F472B6',
      cyan: '#22D3EE',
      purple: '#8B5CF6',
    },
    success: {
      green: '#22C55E',
      greenDark: '#16A34A',
      lime: '#84CC16',
    },
    info: {
      teal: '#14B8A6',
      tealDark: '#0D9488',
      cyanSoft: '#67E8F9',
    },
    warning: {
      orange: '#F97316',
      amber: '#F59E0B',
    },
    danger: {
      red: '#EF4444',
    },
    bg: {
      app: '#F8FAFC',
      surface: '#FFFFFF',
      soft: '#F1F5F9',
    },
    border: {
      soft: '#E2E8F0',
      strong: '#CBD5E1',
    },
    text: {
      primary: '#0F172A',
      body: '#334155',
      muted: '#64748B',
      onDark: '#FFFFFF',
    },
  },
  gradients: {
    cta: ['#EC4899', '#F472B6'],
    statTeal: ['#2DD4BF', '#0D9488'],
    statOrange: ['#FB923C', '#F97316'],
    statCyan: ['#67E8F9', '#06B6D4'],
    powerup: ['#22C55E', '#14B8A6'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 56,
    '6xl': 72,
    containerMargin: 16,
    safeAreaTop: 44,
    safeAreaBottom: 24,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  shadows: {
    pillowy: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
    },
    magentaGlow: {
      shadowColor: '#EC4899',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 32,
      elevation: 12,
    },
  },
  typography: {
    fontFamily: {
      black: 'Inter_900Black',
      extraBold: 'Inter_800ExtraBold',
      bold: 'Inter_700Bold',
      semibold: 'Inter_600SemiBold',
      medium: 'Inter_500Medium',
      regular: 'Inter_400Regular',
    },
    sizes: {
      displayXl: 42,
      displayLg: 32,
      h1: 26,
      h2: 22,
      h3: 18,
      body: 16,
      bodySm: 14,
      caption: 12,
    },
  },
};

export type Theme = typeof theme;
