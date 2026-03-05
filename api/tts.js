const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const BASE = process.env.PREXZY_BASE_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { voice, text, speed, pitch } = req.query;
  if (!text) return res.status(400).json({ error: 'Text required' });

  const voices = {
    aria: 'aria', jenny: 'jenny', guy: 'guy', davis: 'davis',
    tony: 'tony', jane: 'jane', jason: 'jason', sara: 'sara',
    brian: 'brian', emma: 'emma', andrew: 'andrew', michelle: 'michelle',
    sonia: 'sonia', ryan: 'ryan', libby: 'libby', maisie: 'maisie',
    lily: 'lily', charlie: 'charlie',
  };

  const voiceName = voices[voice] || 'aria';
  const params = new URLSearchParams({ text });
  if (speed) params.append('speed', speed);
  if (pitch) params.append('pitch', pitch);

  try {
    const r = await fetch(`${BASE}/tts/${voiceName}?${params.toString()}`);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
