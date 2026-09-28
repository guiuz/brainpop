import { ExpoConfig, ConfigContext } from 'expo/config';

const googleServicesFile = process.env.GOOGLE_SERVICES_FILE;
const adMobAppId = process.env.EXPO_PUBLIC_ADMOB_APP_ID;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'BrainPOP',
  slug: 'brainpop',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './Logo/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './Logo/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#F8FAFC',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.brainpop.app',
    buildNumber: '1',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './Logo/adaptive-icon.png',
      backgroundColor: '#F8FAFC',
    },
    package: 'com.brainpop.app',
    versionCode: 5,
    ...(googleServicesFile ? { googleServicesFile } : {}),
  },
  web: {
    favicon: './Logo/icon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    'expo-font',
    '@react-native-google-signin/google-signin',
    ...(adMobAppId
      ? [['react-native-google-mobile-ads', { androidAppId: adMobAppId }]]
      : []),
  ],
  scheme: 'brainpop',
  extra: {
    router: {
      origin: false,
    },
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  },
  owner: 'theguiuz',
});
