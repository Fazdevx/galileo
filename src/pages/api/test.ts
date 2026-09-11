import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasApiKey: !!import.meta.env.PUBLIC_FIREBASE_API_KEY,
      hasProjectId: !!import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};