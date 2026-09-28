import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function requiredPublicConfig(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Configuração ausente: ${name}. Copie .env.example para .env e preencha o valor localmente.`);
  }
  return value;
}

const firebaseConfig = {
  apiKey: requiredPublicConfig('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requiredPublicConfig('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredPublicConfig('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: requiredPublicConfig('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredPublicConfig('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredPublicConfig('EXPO_PUBLIC_FIREBASE_APP_ID'),
};

// Initialize Firebase safely without duplicate app warning
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Configure platform-appropriate persistence
const getFirebaseAuth = () => {
  try {
    if (Platform.OS === 'web') {
      return initializeAuth(app, {
        persistence: browserLocalPersistence,
      });
    }
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // If auth was already initialized (e.g. fast refresh/hot reload), return existing instance
    return getAuth(app);
  }
};

export const auth = getFirebaseAuth();
export const db = getFirestore(app);

export default app;
