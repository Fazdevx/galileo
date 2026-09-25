// Firebase Client SDK - Solo para uso en el navegador
// Este archivo solo debe importarse dinámicamente en el cliente

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
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

let app = null;
let dbInstance = null;
let authInstance = null;

// Solo inicializar en el navegador
if (typeof window !== 'undefined') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Long polling para evitar bloqueos por ad-blockers
    dbInstance = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
    authInstance = getAuth(app);
  } catch (error) {
    console.error('[Firebase] Error:', error);
  }
}

export const db = dbInstance;
export const auth = authInstance;
export const FIREBASE_CONFIGURED = typeof window !== 'undefined' && !!dbInstance;