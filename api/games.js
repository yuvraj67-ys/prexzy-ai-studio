const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const BASE = process.env.PREXZY_BASE_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, level } = req.query;
  const lvl = level || 'easy';

  const types = {
    guess:     `${BASE}/game/quizguess?level=${lvl}`,
    puzzle:    `${BASE}/game/quizpuzzle?level=${lvl}`,
    truefalse: `${BASE}/game/quiztruefalse?level=${lvl}`,
    random:    `${BASE}/game/quizrandom?level=${lvl}`,
    categories:`${BASE}/game/quizcategories`,
  };

  if (!types[type]) return res.status(400).json({ error: 'Invalid type.' });

  try {
    const r = await fetch(types[type]);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
