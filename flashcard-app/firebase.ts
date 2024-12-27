// firebase.ts (or wherever you configure Firebase)
import { initializeApp } from 'firebase/app';
import { 
  initializeAuth,
  getReactNativePersistence 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyApkplFm-KtO1ShIMZoVOsNNsoecn0mQvY",
    authDomain: "betty-flashcard-app.firebaseapp.com",
    projectId: "betty-flashcard-app",
    storageBucket: "betty-flashcard-app.firebasestorage.app",
    messagingSenderId: "502740374658",
    appId: "1:502740374658:web:fcab9d38eb4c1273d8109b",
    measurementId: "G-ZRC4058JW1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});