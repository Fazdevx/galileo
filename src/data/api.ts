import type { OlimpiadasData } from './olimpiadasStore';
import { DEFAULT_DATA } from './olimpiadasStore';

// Firebase se inicializa solo en el cliente
// Este módulo es seguro para importar en el servidor porque
// solo usa Firebase cuando window está definido
let firebaseReady = false;
let firebaseDb = null;

async function initFirebase() {
  if (firebaseReady) return firebaseDb;
  
  try {
    const { db } = await import('../lib/firebase');
    firebaseDb = db;
    firebaseReady = true;
    return db;
  } catch (error) {
    console.error('[Firebase] Error al inicializar:', error);
    return null;
  }
}

// Solo disponible en el cliente
export const API_CONFIGURED = typeof window !== 'undefined';

// Estructura en Firebase: colección "olimpiadas" / documento "olimpiadas-data"
const COLLECTION_NAME = 'olimpiadas';
const DOCUMENT_ID = 'olimpiadas-data';

export async function fetchData(): Promise<OlimpiadasData> {
  // Solo funciona en el navegador
  if (typeof window === 'undefined') return DEFAULT_DATA;
  
  try {
    const db = await initFirebase();
    if (!db) return DEFAULT_DATA;
    
    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as OlimpiadasData;
      console.log('[Firebase] Datos obtenidos:', data);
      if (data.sections && data.sports && data.games && data.heroStats) {
        return data;
      }
    }
    
    // Inicializar con datos por defecto si está vacío
    console.log('[Firebase] Inicializando con datos por defecto');
    await setDoc(docRef, DEFAULT_DATA);
    return DEFAULT_DATA;
  } catch (error) {
    console.warn('[Firebase] Error:', error);
    return DEFAULT_DATA;
  }
}

export async function saveData(data: OlimpiadasData): Promise<boolean> {
  // Solo funciona en el navegador
  if (typeof window === 'undefined') return false;
  
  try {
    const db = await initFirebase();
    if (!db) return false;
    
    const { doc, setDoc } = await import('firebase/firestore');
    
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await setDoc(docRef, data);
    console.log('[Firebase] Datos guardados');
    return true;
  } catch (error) {
    console.warn('[Firebase] Error al guardar:', error);
    return false;
  }
}
