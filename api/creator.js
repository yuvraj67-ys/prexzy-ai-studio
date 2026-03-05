const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const BASE = process.env.PREXZY_BASE_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, text, topText, bottomText, background, color } = req.query;

  const types = {
    textimage: `${BASE}/imagecreator/image?text=${encodeURIComponent(text||'Hello')}&background=${encodeURIComponent(background||'%23000000')}&color=${encodeURIComponent(color||'%23ffffff')}`,
    gif:       `${BASE}/imagecreator/gif?text=${encodeURIComponent(text||'Hello')}&background=${encodeURIComponent(background||'%23000000')}&color=${encodeURIComponent(color||'%23ffffff')}`,
    meme:      `${BASE}/imagecreator/meme?topText=${encodeURIComponent(topText||'TOP')}&bottomText=${encodeURIComponent(bottomText||'BOTTOM')}`,
    spongebob: `${BASE}/imagecreator/spongebob?text=${encodeURIComponent(text||'How dare you')}`,
    ttp:       `${BASE}/imagecreator/ttp?text=${encodeURIComponent(text||'Hello')}`,
  };

  if (!types[type]) return res.status(400).json({ error: 'Invalid type' });

  try {
    const r = await fetch(types[type]);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
