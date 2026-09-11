import type { APIRoute } from 'astro';

// This endpoint is only used during build/prerendering
// At runtime, Firebase is accessed directly from the client
export const prerender = false;

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ success: false, error: 'Use client-side Firebase' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};