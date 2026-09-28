// Firebase Client SDK - Solo para uso en el navegador
// Este archivo solo debe importarse dinámicamente en el cliente

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebase.config';

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
