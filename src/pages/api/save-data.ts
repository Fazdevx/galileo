import { saveData } from '../../data/api';
import type { APIRoute } from 'astro';
import type { OlimpiadasData } from '../../data/olimpiadasStore';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[API] Received save request');
    console.log('[API] Request headers:', Object.fromEntries(request.headers.entries()));
    
    let data: OlimpiadasData;
    
    const contentType = request.headers.get('content-type');
    console.log('[API] Content-Type:', contentType);
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await request.formData();
      const dataString = formData.get('data') as string;
      console.log('[API] FormData data string length:', dataString?.length);
      console.log('[API] FormData data preview:', dataString?.substring(0, 200));
      
      if (!dataString) {
        console.error('[API] Empty FormData data');
        return new Response(JSON.stringify({ success: false, error: 'Empty FormData data' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      data = JSON.parse(dataString) as OlimpiadasData;
    } else {
      // Handle JSON
      const text = await request.text();
      console.log('[API] JSON body length:', text.length);
      console.log('[API] JSON body preview:', text.substring(0, 200));
      
      if (!text || text.trim() === '') {
        console.error('[API] Empty JSON body');
        return new Response(JSON.stringify({ success: false, error: 'Empty JSON body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      data = JSON.parse(text) as OlimpiadasData;
    }
    
    console.log('[API] Parsed data:', data);
    
    const success = await saveData(data);
    console.log('[API] Save result:', success);
    
    if (success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Failed to save data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('[API] Error saving data:', error);
    return new Response(JSON.stringify({ success: false, error: 'Invalid request', details: String(error) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};