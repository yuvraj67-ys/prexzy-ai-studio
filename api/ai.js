const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const BASE = process.env.PREXZY_BASE_URL;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { tool, prompt, text, code, language, target, source, model, dream } = req.query;

  const routes = {
    chatgpt:     `${BASE}/ai/chatgpt?prompt=${encodeURIComponent(prompt||text||'')}`,
    claude:      `${BASE}/ai/claude?text=${encodeURIComponent(text||prompt||'')}`,
    gpt4:        `${BASE}/ai/gpt4?text=${encodeURIComponent(text||prompt||'')}`,
    gpt5:        `${BASE}/ai/gpt-5?text=${encodeURIComponent(text||prompt||'')}`,
    copilot:     `${BASE}/ai/copilot?text=${encodeURIComponent(text||prompt||'')}`,
    copilotdeep: `${BASE}/ai/copilot-think?text=${encodeURIComponent(text||prompt||'')}`,
    deepseek:    `${BASE}/ai/deepseekchat?prompt=${encodeURIComponent(prompt||text||'')}`,
    deepseekr:   `${BASE}/ai/deepseekreasoner?prompt=${encodeURIComponent(prompt||text||'')}`,
    llama4:      `${BASE}/ai/chat--cf-meta-llama-4-scout-17b-16e-instruct?prompt=${encodeURIComponent(prompt||text||'')}`,
    mistral:     `${BASE}/ai/chat--cf-mistralai-mistral-small-3-1-24b-instruct?prompt=${encodeURIComponent(prompt||text||'')}`,
    qwq:         `${BASE}/ai/chat--cf-qwen-qwq-32b?prompt=${encodeURIComponent(prompt||text||'')}`,
    story:       `${BASE}/ai/quick?text=${encodeURIComponent(text||prompt||'')}`,
    dream:       `${BASE}/ai/dream?dream=${encodeURIComponent(dream||text||'')}`,
    summarize:   `${BASE}/ai/summarize?text=${encodeURIComponent(text||'')}`,
    logical:     `${BASE}/ai/logical?text=${encodeURIComponent(text||'')}`,
    creative:    `${BASE}/ai/creative?text=${encodeURIComponent(text||'')}`,
    prompttocode:`${BASE}/ai/prompttocode?prompt=${encodeURIComponent(prompt||'')}&language=${encodeURIComponent(language||'javascript')}`,
    detectbugs:  `${BASE}/ai/detectbugs?code=${encodeURIComponent(code||'')}`,
    convertcode: `${BASE}/ai/convertcode?code=${encodeURIComponent(code||'')}&target=${encodeURIComponent(target||'python')}&source=${encodeURIComponent(source||'')}`,
    explaincode: `${BASE}/ai/explaincode?code=${encodeURIComponent(code||'')}`,
    detectai:    `${BASE}/ai/aidetector?text=${encodeURIComponent(text||'')}&wait=true`,
  };

  if (!routes[tool]) return res.status(400).json({ error: 'Invalid tool. Use: ' + Object.keys(routes).join(', ') });

  try {
    const r = await fetch(routes[tool]);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
