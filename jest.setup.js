/* eslint-disable no-undef */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Global Firebase mocks for testing environment
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  initializeAuth: jest.fn(() => ({ currentUser: null })),
  getReactNativePersistence: jest.fn(),
  browserLocalPersistence: {},
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn().mockResolvedValue(undefined),
  signInAnonymously: jest.fn(),
  GoogleAuthProvider: Object.assign(
    jest.fn().mockImplementation(() => ({
      setCustomParameters: jest.fn(),
    })),
    {
      credential: jest.fn((idToken) => ({ providerId: 'google.com', signInMethod: 'google.com', token: idToken })),
    }
  ),
  signInWithCredential: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ docs: [] }),
  getDoc: jest.fn().mockResolvedValue({ exists: () => false }),
  setDoc: jest.fn().mockResolvedValue(undefined),
  updateDoc: jest.fn().mockResolvedValue(undefined),
  addDoc: jest.fn().mockResolvedValue({ id: 'mock-doc-id' }),
  increment: jest.fn((n) => n),
  serverTimestamp: jest.fn().mockReturnValue('MOCK_TIMESTAMP'),
  onSnapshot: jest.fn(() => jest.fn()),
}));

// Mock do @react-native-google-signin/google-signin
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn(),
    signOut: jest.fn().mockResolvedValue(undefined),
    isSignedIn: jest.fn().mockResolvedValue(false),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
  },
}));

// Mock do expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      googleWebClientId: 'mock-web-client-id.apps.googleusercontent.com',
    },
  },
}));
