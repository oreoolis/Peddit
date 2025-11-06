export async function sendChat(messages, opts = {}) {
  const url = import.meta.env.VITE_CHAT_PROXY_URL;
  if (!url) throw new Error('VITE_CHAT_PROXY_URL is not set');

  const body = {
    model: opts.model || import.meta.env.VITE_CHAT_MODEL || 'openrouter/auto',
    messages,
    temperature: opts.temperature ?? 0.7,
  };

  if (opts.reasoning) {
    body.reasoning = { effort: opts.reasoningEffort || 'medium' };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`Proxy error ${res.status}: ${msg}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

/**
 * Streaming chat using SSE from OpenRouter (OpenAI-compatible).
 * Calls opts.onToken(token) for each incremental delta.
 * Returns the final full text when stream completes.
 */
export async function sendChatStream(messages, opts = {}) {
  const url = import.meta.env.VITE_CHAT_PROXY_URL;
  if (!url) throw new Error('VITE_CHAT_PROXY_URL is not set');

  const controller = opts.controller || new AbortController();
  const signal = controller.signal;

  const body = {
    model: opts.model || import.meta.env.VITE_CHAT_MODEL || 'openrouter/auto',
    messages,
    temperature: opts.temperature ?? 0.7,
    stream: true,
  };

  if (opts.reasoning) {
    body.reasoning = { effort: opts.reasoningEffort || 'medium' };
  }

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
    // Fallback: some envs may not stream; try normal path
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      const full = data?.choices?.[0]?.message?.content ?? '';
      if (full && typeof opts.onToken === 'function') opts.onToken(full);
      return full;
    } catch {
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

      // Process only complete lines; keep last partial in buffer
      let lastNewline = buffer.lastIndexOf('\n');
      if (lastNewline === -1) continue;
      const complete = buffer.slice(0, lastNewline);
      buffer = buffer.slice(lastNewline + 1);

      const lines = complete.split('\n');
      for (let line of lines) {
        if (!line) continue;
        if (line.endsWith('\r')) line = line.slice(0, -1);
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trimStart();
        if (!dataStr) continue;
        if (dataStr === '[DONE]') {
          done = true;
          break;
        }
        try {
          const json = JSON.parse(dataStr);
          const delta = json?.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            full += delta;
            if (typeof opts.onToken === 'function') opts.onToken(delta);
          }
        } catch {
          // Ignore until we receive a full JSON line
        }
      }
    }
  }

  // Process any trailing complete line left in buffer
  const tail = buffer.trim();
  if (tail && tail.startsWith('data:')) {
    const dataStr = tail.slice(5).trimStart();
    try {
      const json = JSON.parse(dataStr);
      const delta = json?.choices?.[0]?.delta?.content ?? '';
      if (delta) {
        full += delta;
        if (typeof opts.onToken === 'function') opts.onToken(delta);
      }
    } catch {}
  }

  return full;
}

async function safeText(res) {
  try { return await res.text() } catch { return '<no body>' }
}
