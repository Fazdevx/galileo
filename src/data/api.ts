import type { OlimpiadasData } from './olimpiadasStore';
import { DEFAULT_DATA } from './olimpiadasStore';

// Backend API URL - Change this to your deployed backend URL
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

export const API_CONFIGURED = true;

export async function fetchData(): Promise<OlimpiadasData> {
  try {
    const response = await fetch(`${API_URL}/api/data`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.warn('[API] Error fetching data:', error);
    return DEFAULT_DATA;
  }
}

export async function saveData(data: OlimpiadasData): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.warn('[API] Error saving data:', error);
    return false;
  }
}
