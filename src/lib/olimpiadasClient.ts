import type { OlimpiadasData } from '../data/olimpiadasStore';
import { fetchData, API_CONFIGURED } from '../data/api';

export const STORAGE_KEY = 'galileo-olimpiadas-v2';

export { API_CONFIGURED };

export let cloudDisabled = false;

export function loadFromLocal(): OlimpiadasData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OlimpiadasData>;
    return {
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      sports: Array.isArray(parsed.sports) ? parsed.sports : [],
      games: Array.isArray(parsed.games) ? parsed.games : [],
      heroStats: parsed.heroStats || { secciones: 0, disciplinas: 0, dias: 0 },
    };
  } catch {
    return null;
  }
}

export async function loadFromApi(defaultData: OlimpiadasData): Promise<OlimpiadasData | null> {
  if (!API_CONFIGURED || cloudDisabled) return null;
  try {
    const data = await fetchData();
    if (data && data.sections && data.sports && data.games) {
      return data;
    }
    return null;
  } catch (error) {
    console.warn('[Client] Error loading from API:', error);
    return null;
  }
}

export async function load(defaultData: OlimpiadasData): Promise<OlimpiadasData> {
  const remote = await loadFromApi(defaultData);
  const local = remote ? null : loadFromLocal();
  const source = remote || local || defaultData;
  return {
    sections: source.sections || defaultData.sections,
    sports: source.sports || defaultData.sports,
    games: source.games || defaultData.games,
    heroStats: source.heroStats || defaultData.heroStats,
  };
}

export function saveToLocal(data: OlimpiadasData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('galileo-data-changed'));
  } catch (e) {
    console.error('Error al guardar localmente:', e);
  }
}

export async function saveToApi(data: OlimpiadasData): Promise<boolean> {
  if (!API_CONFIGURED || cloudDisabled) return false;
  try {
    const docRef = doc(db, 'olimpiadas', OIMPIADAS_DOC_ID);
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.warn('[Firebase] Error al guardar en API:', error);
    return false;
  }
}

export async function save(data: OlimpiadasData): Promise<boolean> {
  saveToLocal(data);
  const ok = await saveToApi(data);
  return ok;
}

export function calculateStandings(games: OlimpiadasData['games'], sections: OlimpiadasData['sections']) {
  const stats = sections.map((s) => ({
    id: s.id,
    name: s.name,
    initial: s.initial,
    color: s.color,
    pj: 0,
    g: 0,
    e: 0,
    p: 0,
    pts: 0,
  }));

  games.forEach((g) => {
    if (!g.status.includes('Finalizado')) return;
    const l = stats.find((x) => x.name === g.local);
    const v = stats.find((x) => x.name === g.visit);
    if (!l || !v) return;
    l.pj++;
    v.pj++;
    if (g.localScore > g.visitScore) {
      l.g++;
      l.pts += 3;
      v.p++;
    } else if (g.localScore < g.visitScore) {
      v.g++;
      v.pts += 3;
      l.p++;
    } else {
      l.e++;
      v.e++;
      l.pts += 1;
      v.pts += 1;
    }
  });

  stats.sort((a, b) => b.pts - a.pts || b.g - a.g);
  return stats;
}

export function onDataChanged(callback: () => void) {
  const handler = () => callback();
  window.addEventListener('galileo-data-changed', handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) handler();
  });
  return () => {
    window.removeEventListener('galileo-data-changed', handler);
    window.removeEventListener('storage', handler);
  };
}
