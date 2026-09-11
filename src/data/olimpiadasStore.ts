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
  type: 'descuento_mensualidad' | 'descuento_matricula' | 'libro' | 'cuaderno' | 'bonus';
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
  { id: 'p1', name: '5% Descuento', description: '5% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 5, color: 'bg-emerald-500', icon: 'money' },
  { id: 'p2', name: '10% Descuento', description: '10% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 10, color: 'bg-brand-500', icon: 'gift' },
  { id: 'p3', name: '15% Descuento', description: '15% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 15, color: 'bg-purple-500', icon: 'star' },
  { id: 'p4', name: '20% Matrícula', description: '20% de descuento en matrícula de tu hijo', type: 'descuento_matricula', value: 20, color: 'bg-rose-500', icon: 'graduation' },
  { id: 'p5', name: '1 Libro', description: '1 libro de regalo para tu hijo', type: 'libro', value: 1, color: 'bg-sky-500', icon: 'book' },
  { id: 'p6', name: '2 Cuadernos', description: '2 cuadernos de regalo', type: 'cuaderno', value: 2, color: 'bg-amber-500', icon: 'notebook' },
  { id: 'p7', name: '5% Descuento', description: '5% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 5, color: 'bg-emerald-500', icon: 'money' },
  { id: 'p8', name: '10% Descuento', description: '10% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 10, color: 'bg-brand-500', icon: 'gift' },
  { id: 'p9', name: '15% Descuento', description: '15% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 15, color: 'bg-purple-500', icon: 'star' },
  { id: 'p10', name: '20% Matrícula', description: '20% de descuento en matrícula de tu hijo', type: 'descuento_matricula', value: 20, color: 'bg-rose-500', icon: 'graduation' },
  { id: 'p11', name: '1 Libro', description: '1 libro de regalo para tu hijo', type: 'libro', value: 1, color: 'bg-sky-500', icon: 'book' },
  { id: 'p12', name: '2 Cuadernos', description: '2 cuadernos de regalo', type: 'cuaderno', value: 2, color: 'bg-amber-500', icon: 'notebook' },
  { id: 'p13', name: '5% Descuento', description: '5% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 5, color: 'bg-emerald-500', icon: 'money' },
  { id: 'p14', name: '10% Descuento', description: '10% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 10, color: 'bg-brand-500', icon: 'gift' },
  { id: 'p15', name: '15% Descuento', description: '15% de descuento en tu próxima mensualidad', type: 'descuento_mensualidad', value: 15, color: 'bg-purple-500', icon: 'star' },
  { id: 'p16', name: '20% Matrícula', description: '20% de descuento en matrícula de tu hijo', type: 'descuento_matricula', value: 20, color: 'bg-rose-500', icon: 'graduation' },
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
