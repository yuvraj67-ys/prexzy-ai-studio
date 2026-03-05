const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const BASE = process.env.PREXZY_BASE_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { style, prompt, negative_prompt } = req.query;

  const styles = {
    dalle:      `${BASE}/ai/dalle?prompt=${encodeURIComponent(prompt||'')}`,
    sdxl:       `${BASE}/ai/image--cf-bytedance-stable-diffusion-xl-lightning?prompt=${encodeURIComponent(prompt||'')}`,
    flux:       `${BASE}/ai/image--cf-black-forest-labs-flux-1-schnell?prompt=${encodeURIComponent(prompt||'')}`,
    dreamshaper:`${BASE}/ai/image--cf-lykon-dreamshaper-8-lcm?prompt=${encodeURIComponent(prompt||'')}`,
    lucid:      `${BASE}/ai/image--cf-leonardo-lucid-origin?prompt=${encodeURIComponent(prompt||'')}`,
    gemini:     `${BASE}/ai/gemimage?prompt=${encodeURIComponent(prompt||'')}`,
    realistic:  `${BASE}/ai/realistic?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    anime:      `${BASE}/ai/anime?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    fantasy:    `${BASE}/ai/fantasy?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    cyberpunk:  `${BASE}/ai/cyberpunk?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    watercolor: `${BASE}/ai/watercolor?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    oilpainting:`${BASE}/ai/oil-painting?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    pixelart:   `${BASE}/ai/pixel-art?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    sketch:     `${BASE}/ai/sketch?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    cartoon:    `${BASE}/ai/cartoon?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    abstract:   `${BASE}/ai/abstract?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    scifi:      `${BASE}/ai/sci-fi?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    horror:     `${BASE}/ai/horror?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    vintage:    `${BASE}/ai/vintage?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    popart:     `${BASE}/ai/pop-art?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
    steampunk:  `${BASE}/ai/steampunk?prompt=${encodeURIComponent(prompt||'')}&negative_prompt=${encodeURIComponent(negative_prompt||'')}`,
  };

  if (!styles[style]) return res.status(400).json({ error: 'Invalid style. Use: ' + Object.keys(styles).join(', ') });

  try {
    const r = await fetch(styles[style]);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
