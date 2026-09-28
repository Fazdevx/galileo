/**
 * Configuracion de Firebase compartida.
 *
 * Se separa de src/lib/firebase.ts porque ese archivo solo inicializa en el
 * navegador (getApps/getApp no existen en Node). Aqui solo se expone el
 * proyecto y la API key, que ademas ya son publicos: viajan en el bundle del
 * cliente y las reglas de Firestore permiten lectura anonima.
 */

export const firebaseConfig = {
  apiKey: 'AIzaSyAgjrkE_Ah-mKOm8naH-aFEB7UrschO40o',
  authDomain: 'galiweb-4cc7d.firebaseapp.com',
  projectId: 'galiweb-4cc7d',
  storageBucket: 'galiweb-4cc7d.firebasestorage.app',
  messagingSenderId: '192323726068',
  appId: '1:192323726068:web:9cebbbd6d9e20c12ce0ca1',
  measurementId: 'G-V9WEJ4RYTG',
};

export const PROJECT_ID = firebaseConfig.projectId;
export const API_KEY = firebaseConfig.apiKey;
