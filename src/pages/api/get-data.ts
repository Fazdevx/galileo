import { fetchData, API_CONFIGURED } from '../../data/api';
import { DEFAULT_DATA } from '../../data/olimpiadasStore';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await fetchData();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error fetching data:', error);
    // Return default data instead of error to prevent UI breakage
    return new Response(JSON.stringify(DEFAULT_DATA), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};