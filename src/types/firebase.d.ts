import { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  /**
   * Fornece persistência baseada em AsyncStorage no React Native
   */
  export function getReactNativePersistence(storage: unknown): Persistence;
}
