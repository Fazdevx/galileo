import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAgjrkE_Ah-mKOm8naH-aFEB7UrschO40o",
  authDomain: "galiweb-4cc7d.firebaseapp.com",
  projectId: "galiweb-4cc7d",
  storageBucket: "galiweb-4cc7d.firebasestorage.app",
  messagingSenderId: "192323726068",
  appId: "1:192323726068:web:9cebbbd6d9e20c12ce0ca1",
  measurementId: "G-V9WEJ4RYTG"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

export const FIREBASE_CONFIGURED = Boolean(
  import.meta.env.PUBLIC_FIREBASE_API_KEY &&
  import.meta.env.PUBLIC_FIREBASE_PROJECT_ID
);
