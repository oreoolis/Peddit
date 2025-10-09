export async function sendChat(messages, opts = {}) {
  const url = import.meta.env.VITE_CHAT_PROXY_URL
  if (!url) throw new Error('VITE_CHAT_PROXY_URL is not set')

  const body = {
    model: opts.model || import.meta.env.VITE_CHAT_MODEL || 'openrouter/auto',
    messages,
    temperature: 0.7,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const msg = await safeText(res)
    throw new Error(`Proxy error ${res.status}: ${msg}`)
  }

  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

async function safeText(res) {
  try { return await res.text() } catch { return '<no body>' }
}
