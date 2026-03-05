const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const BASE = process.env.PREXZY_BASE_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, query, url } = req.query;

  const routes = {
    search:  `${BASE}/anime/animesearch?query=${encodeURIComponent(query||'')}`,
    detail:  `${BASE}/anime/animedetail?url=${encodeURIComponent(url||'')}`,
    hug:     `${BASE}/anime/hug`, slap: `${BASE}/anime/slap`,
    pat:     `${BASE}/anime/pat`, cry: `${BASE}/anime/cry`,
    dance:   `${BASE}/anime/dance`, wink: `${BASE}/anime/wink`,
    smile:   `${BASE}/anime/smile`, happy: `${BASE}/anime/happy`,
    cuddle:  `${BASE}/anime/cuddle`, blush: `${BASE}/anime/blush`,
    poke:    `${BASE}/anime/poke`, wave: `${BASE}/anime/wave`,
    bonk:    `${BASE}/anime/bonk`, yeet: `${BASE}/anime/yeet`,
  };

  if (!routes[action]) return res.status(400).json({ error: 'Invalid action.' });

  try {
    const r = await fetch(routes[action]);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
