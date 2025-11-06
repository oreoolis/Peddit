// /api/chat.js — Vercel serverless function with SSE pass‑through
// - POST with { stream: true } -> forwards OpenRouter SSE chunks to client
// - POST with { stream: false } or omitted -> returns JSON { content, usage, raw }
// - Handles CORS and OPTIONS
// - Hides OPENROUTER_API_KEY on the server

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured on server" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch {
    body = {};
  }

  const {
    model = process.env.DEFAULT_CHAT_MODEL || "openrouter/auto",
    messages = [],
    temperature = 0.7,
    stream = false,
    reasoning
  } = body;

  const payload = { model, messages, temperature, stream: !!stream };
  if (reasoning) payload.reasoning = reasoning; // e.g. { effort: 'low'|'medium'|'high' }

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "",
      "X-Title": process.env.OPENROUTER_APP_NAME || "Peddit"
    },
    body: JSON.stringify(payload),
  });

  if (!stream) {
    const txt = await upstream.text();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `OpenRouter ${upstream.status}`, upstream: safeParse(txt) });
    }
    const data = safeParse(txt);
    const content = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ? data.choices[0].message.content : "";
    const usage = (data && data.usage) ? data.usage : {};
    return res.status(200).json({ content, usage, raw: data });
  }

  // Streaming SSE pass-through
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  try {
    if (!upstream.ok || !upstream.body) {
      const txt = await upstream.text().catch(() => "");
      res.write(`data: ${JSON.stringify({ error: `OpenRouter ${upstream.status}`, upstream: safeParse(txt) })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    // Pipe upstream chunks as-is (OpenAI-style SSE)
    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) res.write(Buffer.from(value).toString("utf8"));
    }
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "Proxy stream failure", detail: String(err) })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
}

function safeParse(s) {
  try { return JSON.parse(s) } catch { return { raw: s } }
}
