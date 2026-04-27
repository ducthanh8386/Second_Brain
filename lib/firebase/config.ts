import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present
const validateConfig = () => {
  const requiredKeys: (keyof typeof firebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  for (const key of requiredKeys) {
    if (!firebaseConfig[key]) {
      throw new Error(
        `Missing Firebase configuration: NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}. ` +
        `Please add it to your .env.local file.`
      );
    }
  }
};

// Initialize Firebase (only once)
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    validateConfig();
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }

  // Get services
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);

  // Set persistence to LOCAL so user stays logged in across sessions
  if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Failed to set Firebase persistence:', error);
  });
}
} catch (error) {
  console.error('Firebase initialization failed:', error);
  throw error;
}

export { firebaseApp, auth, firestore as db , storage };
console.log("TEST API KEY HIỆN TẠI LÀ:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);