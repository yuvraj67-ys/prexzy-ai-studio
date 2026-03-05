const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const BASE = process.env.PREXZY_BASE_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { platform, url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const platforms = {
    auto:       `${BASE}/download/aio?url=${encodeURIComponent(url)}`,
    youtube:    `${BASE}/download/ytdl?url=${encodeURIComponent(url)}`,
    ytaudio:    `${BASE}/download/ytaudio?url=${encodeURIComponent(url)}`,
    ytvideo:    `${BASE}/download/ytvideo?url=${encodeURIComponent(url)}`,
    ytinfo:     `${BASE}/download/ytinfo?url=${encodeURIComponent(url)}`,
    tiktok:     `${BASE}/download/tiktokV2?url=${encodeURIComponent(url)}`,
    instagram:  `${BASE}/download/ig2?url=${encodeURIComponent(url)}`,
    facebook:   `${BASE}/download/facebookv2?url=${encodeURIComponent(url)}`,
    twitter:    `${BASE}/download/twitter?url=${encodeURIComponent(url)}`,
    pinterest:  `${BASE}/download/pinterestV2?url=${encodeURIComponent(url)}`,
    spotify:    `${BASE}/download/spotify?url=${encodeURIComponent(url)}`,
    soundcloud: `${BASE}/download/soundcloud?url=${encodeURIComponent(url)}`,
    threads:    `${BASE}/download/threadsV2?url=${encodeURIComponent(url)}`,
    capcut:     `${BASE}/download/capcut?url=${encodeURIComponent(url)}`,
  };

  const endpoint = platforms[platform] || platforms['auto'];

  try {
    const r = await fetch(endpoint);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
