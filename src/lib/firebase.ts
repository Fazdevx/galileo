import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration - Client-side only
const firebaseConfig = {
  apiKey: "AIzaSyAgjrkE_Ah-mKOm8naH-aFEB7UrschO40o",
  authDomain: "galiweb-4cc7d.firebaseapp.com",
  projectId: "galiweb-4cc7d",
  storageBucket: "galiweb-4cc7d.firebasestorage.app",
  messagingSenderId: "192323726068",
  appId: "1:192323726068:web:9cebbbd6d9e20c12ce0ca1",
  measurementId: "G-V9WEJ4RYTG"
};

// Only initialize on client side
let app: ReturnType<typeof initializeApp> | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(app);
    authInstance = getAuth(app);
    console.log('[Firebase] Client SDK initialized');
  } catch (error) {
    console.error('[Firebase] Init error:', error);
  }
}

export const db = dbInstance;
export const auth = authInstance;
export const FIREBASE_CONFIGURED = typeof window !== 'undefined' && !!dbInstance;
