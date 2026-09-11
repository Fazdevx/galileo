import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || "AIzaSyAgjrkE_Ah-mKOm8naH-aFEB7UrschO40o",
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || "galiweb-4cc7d.firebaseapp.com",
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "galiweb-4cc7d",
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || "galiweb-4cc7d.firebasestorage.app",
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "192323726068",
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || "1:192323726068:web:9cebbbd6d9e20c12ce0ca1",
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || "G-V9WEJ4RYTG"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

export const FIREBASE_CONFIGURED = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);
