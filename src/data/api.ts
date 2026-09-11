import type { OlimpiadasData } from './olimpiadasStore';
import { DEFAULT_DATA } from './olimpiadasStore';
import { db, FIREBASE_CONFIGURED } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const OIMPIADAS_DOC_ID = 'olimpiadas-data';

export const API_CONFIGURED = FIREBASE_CONFIGURED;

let isQuotaExhausted = false;

export async function fetchData(): Promise<OlimpiadasData> {
  if (!API_CONFIGURED || isQuotaExhausted) return DEFAULT_DATA;
  try {
    const docRef = doc(db, 'olimpiadas', OIMPIADAS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as OlimpiadasData;
      console.log('[Firebase] Datos obtenidos de Firebase:', data);
      // Validate data structure
      if (data.sections && data.sports && data.games && data.heroStats) {
        return data;
      }
    }
    
    // Initialize Firebase with default data if empty or invalid
    console.log('[Firebase] Firebase vacío o inválido, inicializando con datos predeterminados');
    console.log('[Firebase] Creando estructura: colección "olimpiadas", documento "olimpiadas-data"');
    await setDoc(docRef, DEFAULT_DATA);
    console.log('[Firebase] Datos predeterminados guardados en Firebase:', DEFAULT_DATA);
    return DEFAULT_DATA;
  } catch (error) {
    console.warn('[Firebase] Error al obtener datos:', error);
    console.log('[Firebase] Usando datos predeterminados como fallback');
    return DEFAULT_DATA;
  }
}

export async function saveData(data: OlimpiadasData): Promise<boolean> {
  if (!API_CONFIGURED || isQuotaExhausted) return false;
  try {
    const docRef = doc(db, 'olimpiadas', OIMPIADAS_DOC_ID);
    console.log('[Firebase] Guardando datos en estructura correcta: colección "olimpiadas", documento "olimpiadas-data"');
    await setDoc(docRef, data);
    console.log('[Firebase] Datos guardados exitosamente en Firebase:', data);
    return true;
  } catch (error) {
    console.warn('[Firebase] Error al guardar datos:', error);
    return false;
  }
}
