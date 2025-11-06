export const config = { runtime: 'edge' };

// Vercel Edge Function to proxy chat requests to OpenRouter.
// Expects env var OPENROUTER_API_KEY to be configured in Vercel.
export default async function handler(req) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: cors });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response('Missing OPENROUTER_API_KEY', { status: 500, headers: cors });
  }

  try {
    // Forward the exact JSON body as-is; supports both normal and streaming requests.
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Helpful but optional metadata headers for OpenRouter
        'HTTP-Referer': req.headers.get('origin') || 'https://peddit-coral.vercel.app',
        'X-Title': 'Peddit',
      },
      body: await req.text(),
    });

    // Pass through status, headers, and body. Keep CORS headers for browser calls.
    const headers = new Headers(upstream.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Proxy failure: ${msg}`, { status: 502, headers: cors });
  }
}

