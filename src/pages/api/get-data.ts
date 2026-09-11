import { DEFAULT_DATA } from '../../data/olimpiadasStore';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  // Return default data directly to avoid Firebase issues in serverless
  return new Response(JSON.stringify(DEFAULT_DATA), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};