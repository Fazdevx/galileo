import { DEFAULT_DATA } from '../../data/olimpiadasStore';
import type { APIRoute } from 'astro';

// This endpoint is used as fallback only
// Client fetches data directly from backend API
export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(DEFAULT_DATA), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};