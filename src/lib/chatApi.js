// src/lib/chatApi.js — Vercel‑compatible, preserves original API
// - Keeps sendChat (returns string) and sendChatStream (onToken + final string)
// - Defaults to '/api/chat' if VITE_CHAT_PROXY_URL not set
// - Accepts either OpenRouter raw shape or proxy shape {content, usage, raw}
// - Safe fallback when streaming is not supported by the server

export async function sendChat(messages, opts = {}) {
  const url = import.meta.env.VITE_CHAT_PROXY_URL || '/api/chat';

  const body = {
    model: opts.model || import.meta.env.VITE_CHAT_MODEL || 'openrouter/auto',
    messages,
    temperature: opts.temperature ?? 0.7,
  };
  if (opts.reasoning) body.reasoning = { effort: opts.reasoningEffort || 'medium' };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`Proxy error ${res.status}: ${msg}`);
  }

  // Accept proxy shape first
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (typeof data?.content === 'string') return data.content;
    return data?.choices?.[0]?.message?.content ?? '';
  } catch {
    // Some proxies may return plain text
    return text;
  }
}

/**
 * Streaming chat over SSE (OpenAI-compatible). If the backend doesn't stream,
 * this falls back to reading the full response once and calling onToken(final).
 * opts:
 *  - onToken(token:string)
 *  - controller?: AbortController
 *  - model?: string
 *  - temperature?: number
 *  - reasoning?: boolean
 *  - reasoningEffort?: 'low'|'medium'|'high'
 */
export async function sendChatStream(messages, opts = {}) {
  const url = import.meta.env.VITE_CHAT_PROXY_URL || '/api/chat';
  const controller = opts.controller || new AbortController();
  const signal = controller.signal;

  const body = {
    model: opts.model || import.meta.env.VITE_CHAT_MODEL || 'openrouter/auto',
    messages,
    temperature: opts.temperature ?? 0.7,
    stream: true,
  };
  if (opts.reasoning) body.reasoning = { effort: opts.reasoningEffort || 'medium' };
a
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`Proxy error ${res.status}: ${msg}`);
  }

  const reader = res.body?.getReader?.();
  if (!reader) {
    // Non-streaming fallback: parse JSON, then emit once
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      const full = typeof data?.content === 'string'
        ? data.content
        : (data?.choices?.[0]?.message?.content ?? '');
      if (full && typeof opts.onToken === 'function') opts.onToken(full);
      return full;
    } catch {
      if (text && typeof opts.onToken === 'function') opts.onToken(text);
      return text;
    }
  }

  const decoder = new TextDecoder('utf-8');
  let full = '';
  let done = false;
  let buffer = '';

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      // Process complete lines only
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || ''; // leftover partial line kept in buffer
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trim(); // after "data:"
        if (dataStr === '[DONE]') { done = true; break; }
        try {
          const json = JSON.parse(dataStr);
          const delta = json?.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            full += delta;
            if (typeof opts.onToken === 'function') opts.onToken(delta);
          }
        } catch {
          // ignore malformed JSON chunks
        }
      }
    }
  }

  return full;
}

async function safeText(res) {
  try { return await res.text() } catch { return '<no body>' }
}
