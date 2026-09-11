import { DEFAULT_DATA } from '../../data/olimpiadasStore';
import type { APIRoute } from 'astro';

// This endpoint is only used during build/prerendering
// At runtime, Firebase is accessed directly from the client
export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(DEFAULT_DATA), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};