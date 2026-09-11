import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Firebase is disabled in serverless environment
  // Data is saved to localStorage on the client side
  return new Response(JSON.stringify({ success: false, error: 'Cloud save is disabled' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};