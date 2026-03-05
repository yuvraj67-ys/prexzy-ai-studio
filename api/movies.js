const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const BASE = process.env.PREXZY_BASE_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, query, url } = req.query;

  try {
    if (action === 'search') {
      const r = await fetch(`${BASE}/moviesearch?query=${encodeURIComponent(query||'')}`);
      const data = await r.json();
      return res.status(200).json(data);
    }
    if (action === 'detail') {
      const r = await fetch(`${BASE}/moviedetail?url=${encodeURIComponent(url||'')}`);
      const data = await r.json();
      return res.status(200).json(data);
    }
    res.status(400).json({ error: 'Use action=search or action=detail' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
