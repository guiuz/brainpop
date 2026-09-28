module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|lucide-react-native|firebase|@firebase)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/backend/', 'firestoreRulesEmulator.test.ts'],
  collectCoverageFrom: [
    'src/store/useGameStore.ts',
    'src/store/useShopStore.ts',
    'src/store/useUserStore.ts',
    'src/utils/**/*.ts',
    '!src/data/questions.ts',
  ],
  coverageThreshold: {
    './src/store/useGameStore.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/store/useShopStore.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
