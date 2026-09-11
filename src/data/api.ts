import type { OlimpiadasData } from './olimpiadasStore';
import { DEFAULT_DATA } from './olimpiadasStore';
import { db, FIREBASE_CONFIGURED } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const OIMPIADAS_DOC_ID = 'olimpiadas-data';

export const API_CONFIGURED = FIREBASE_CONFIGURED;

let isQuotaExhausted = false;

export async function fetchData(): Promise<OlimpiadasData> {
  // Only work on client side
  if (typeof window === 'undefined' || !API_CONFIGURED || !db || isQuotaExhausted) {
    return DEFAULT_DATA;
  }
  try {
    const docRef = doc(db, 'olimpiadas', OIMPIADAS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as OlimpiadasData;
      console.log('[Firebase] Data retrieved:', data);
      if (data.sections && data.sports && data.games && data.heroStats) {
        return data;
      }
    }
    
    // Initialize with default data if empty
    console.log('[Firebase] Initializing with default data');
    await setDoc(docRef, DEFAULT_DATA);
    return DEFAULT_DATA;
  } catch (error) {
    console.warn('[Firebase] Error:', error);
    return DEFAULT_DATA;
  }
}

export async function saveData(data: OlimpiadasData): Promise<boolean> {
  // Only work on client side
  if (typeof window === 'undefined' || !API_CONFIGURED || !db || isQuotaExhausted) {
    return false;
  }
  try {
    const docRef = doc(db, 'olimpiadas', OIMPIADAS_DOC_ID);
    await setDoc(docRef, data);
    console.log('[Firebase] Data saved');
    return true;
  } catch (error) {
    console.warn('[Firebase] Save error:', error);
    return false;
  }
}
