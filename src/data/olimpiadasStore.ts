export type Section = {
  id: string;
  name: string;
  color: string;
  initial: string;
};

export type Game = {
  id: string;
  local: string;
  localScore: number;
  visit: string;
  visitScore: number;
  status: string;
  sport: string;
  date: string;
};

export type OlimpiadasData = {
  sections: Section[];
  sports: string[];
  games: Game[];
  heroStats: { secciones: number; disciplinas: number; dias: number };
  prizes: Prize[];
};

export type Prize = {
  id: string;
  name: string;
  description: string;
  type: 'descuento_souvenirs' | 'test_vocacional' | 'descuento_academia' | 'entrevista_psicologica' | 'reclama_oficina';
  value: number;
  color: string;
  icon: string;
};

export type Winner = {
  id: string;
  prizeId: string;
  timestamp: number;
};

export const PRIZES: Prize[] = [
  { id: 'p1', name: '5% Souvenirs', description: '5% de descuento en souvenirs', type: 'descuento_souvenirs', value: 5, color: 'bg-emerald-500', icon: 'shopping-bag' },
  { id: 'p2', name: 'Test Vocacional', description: 'Test vocacional gratis', type: 'test_vocacional', value: 0, color: 'bg-brand-500', icon: 'clipboard-check' },
  { id: 'p3', name: '15% Academia', description: '15% de descuento en Academia Galileo', type: 'descuento_academia', value: 15, color: 'bg-purple-500', icon: 'graduation-cap' },
  { id: 'p4', name: 'Entrevista Psicológica', description: 'Entrevista psicológica gratis', type: 'entrevista_psicologica', value: 0, color: 'bg-rose-500', icon: 'brain' },
  { id: 'p5', name: 'Reclama tu Premio', description: 'Reclama tu premio en oficina', type: 'reclama_oficina', value: 0, color: 'bg-sky-500', icon: 'gift' },
  { id: 'p6', name: '5% Souvenirs', description: '5% de descuento en souvenirs', type: 'descuento_souvenirs', value: 5, color: 'bg-emerald-500', icon: 'shopping-bag' },
  { id: 'p7', name: 'Test Vocacional', description: 'Test vocacional gratis', type: 'test_vocacional', value: 0, color: 'bg-brand-500', icon: 'clipboard-check' },
  { id: 'p8', name: '15% Academia', description: '15% de descuento en Academia Galileo', type: 'descuento_academia', value: 15, color: 'bg-purple-500', icon: 'graduation-cap' },
  { id: 'p9', name: 'Entrevista Psicológica', description: 'Entrevista psicológica gratis', type: 'entrevista_psicologica', value: 0, color: 'bg-rose-500', icon: 'brain' },
  { id: 'p10', name: 'Reclama tu Premio', description: 'Reclama tu premio en oficina', type: 'reclama_oficina', value: 0, color: 'bg-sky-500', icon: 'gift' },
  { id: 'p11', name: '5% Souvenirs', description: '5% de descuento en souvenirs', type: 'descuento_souvenirs', value: 5, color: 'bg-emerald-500', icon: 'shopping-bag' },
  { id: 'p12', name: 'Test Vocacional', description: 'Test vocacional gratis', type: 'test_vocacional', value: 0, color: 'bg-brand-500', icon: 'clipboard-check' },
  { id: 'p13', name: '15% Academia', description: '15% de descuento en Academia Galileo', type: 'descuento_academia', value: 15, color: 'bg-purple-500', icon: 'graduation-cap' },
  { id: 'p14', name: 'Entrevista Psicológica', description: 'Entrevista psicológica gratis', type: 'entrevista_psicologica', value: 0, color: 'bg-rose-500', icon: 'brain' },
  { id: 'p15', name: 'Reclama tu Premio', description: 'Reclama tu premio en oficina', type: 'reclama_oficina', value: 0, color: 'bg-sky-500', icon: 'gift' },
  { id: 'p16', name: '5% Souvenirs', description: '5% de descuento en souvenirs', type: 'descuento_souvenirs', value: 5, color: 'bg-emerald-500', icon: 'shopping-bag' },
];

export const DEFAULT_DATA: OlimpiadasData = {
  sections: [],
  sports: [],
  games: [],
  heroStats: { secciones: 0, disciplinas: 0, dias: 0 },
  prizes: [...PRIZES],
};

const STORAGE_KEY = 'galileo-olimpiadas-v2';

export function getStoredData(): OlimpiadasData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<OlimpiadasData>;
    return {
      sections: parsed.sections ?? DEFAULT_DATA.sections,
      sports: parsed.sports ?? DEFAULT_DATA.sports,
      games: parsed.games ?? DEFAULT_DATA.games,
      heroStats: parsed.heroStats ?? DEFAULT_DATA.heroStats,
      prizes: Array.isArray(parsed.prizes) ? parsed.prizes : [...DEFAULT_DATA.prizes],
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: OlimpiadasData) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('galileo-data-changed'));
}

export function resetData() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('galileo-data-changed'));
}

export function clearLocalStorage() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  console.log('[LocalStorage] Datos limpiados');
}

export const ADMIN_PASSWORD = 'galileo2026';

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
