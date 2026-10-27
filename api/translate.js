const { API, KEY, SYSTEM, CORS } = require('../lib/prompt');

module.exports = async function handler(req, res) {
  Object.keys(CORS).forEach(k => res.setHeader(k, CORS[k]));
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  // Vercel 会自动解析 JSON body；兼容没解析的情况
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'bad request' });
    return;
  }

  const raw = Array.isArray(body.fields) ? body.fields.slice(0, 120) : [];
  const fields = raw
    .filter(f => f && typeof f.id === 'string' && typeof f.value === 'string' && f.value.trim())
    .map(f => ({
      id: String(f.id).slice(0, 100),
      value: String(f.value).slice(0, 300),
      kind: String(f.kind || '').slice(0, 20)
    }));

  if (!fields.length) {
    res.status(400).json({ error: 'no fields' });
    return;
  }

  let upstream;
  try {
    upstream = await fetch(API, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'auto',
        temperature: 0,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: JSON.stringify(fields) }
        ]
      })
    });
  } catch (e) {
    res.status(502).json({ error: 'upstream unreachable', detail: String((e && e.message) || e) });
    return;
  }

  const text = await upstream.text();
  if (!upstream.ok) {
    res.status(502).json({ error: 'upstream ' + upstream.status, detail: text.slice(0, 300) });
    return;
  }

  let data;
  try { data = JSON.parse(text); } catch (e) {
    res.status(502).json({ error: 'bad upstream payload' });
    return;
  }

  const content = data && data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content : '';
  if (!content) {
    res.status(502).json({ error: 'empty completion' });
    return;
  }

  res.status(200).json({ content });
};
