// ====== UI & NAVIGATION LOGIC ====== //
document.querySelectorAll('.nav-item, .bottom-tab').forEach(el => {
  el.addEventListener('click', () => {
    const tabId = el.getAttribute('data-tab');
    
    // Update active state in nav
    document.querySelectorAll('.nav-item, .bottom-tab').forEach(n => n.classList.remove('active'));
    document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(n => n.classList.add('active'));
    
    // Switch page content
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  });
});

function showToast(msg, type = 'error') {
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:${type==='error'?'#ef4444':'#10b981'};color:white;padding:12px 24px;border-radius:12px;font-weight:600;z-index:9999;animation:fadeIn 0.3s`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showLoading(containerId) {
  document.getElementById(containerId).innerHTML = '<div class="spinner"></div>';
}

function copyText(btn, text) {
  navigator.clipboard.writeText(text);
  const old = btn.innerText;
  btn.innerText = 'Copied!';
  setTimeout(() => btn.innerText = old, 2000);
}

// ====== TAB 1: AI CHAT ====== //
const chatBox = document.getElementById('chatBox');
let isAiTyping = false;

function addChatBubble(text, sender) {
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'chat-user fade-in' : 'chat-ai fade-in';
  
  if(sender === 'ai') {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerText = 'Copy';
    copyBtn.onclick = () => copyText(copyBtn, text);
    div.appendChild(copyBtn);
    
    const content = document.createElement('div');
    content.style.marginTop = '10px';
    content.innerText = text;
    div.appendChild(content);
  } else {
    div.innerText = text;
  }
  
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
  chatBox.innerHTML = '';
  showToast('Chat cleared', 'success');
}

async function sendAIMessage() {
  if (isAiTyping) return;
  const input = document.getElementById('chatInput');
  const prompt = input.value.trim();
  const model = document.getElementById('modelSelect').value;
  
  if (!prompt) return;
  
  input.value = '';
  addChatBubble(prompt, 'user');
  
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'chat-ai';
  loadingDiv.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0;"></div>';
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  isAiTyping = true;

  try {
    const res = await fetch(`/api/ai?tool=${model}&text=${encodeURIComponent(prompt)}&prompt=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    loadingDiv.remove();
    
    const reply = data.result || data.response || data.text || data.message || data.content || JSON.stringify(data);
    addChatBubble(reply, 'ai');
  } catch (e) {
    loadingDiv.remove();
    showToast('AI Request Failed: ' + e.message);
  } finally {
    isAiTyping = false;
  }
}

// ====== TAB 2: IMAGE GENERATOR ====== //
const styles = [
  {id:'dalle', icon:'🎯', name:'DALL-E 3'}, {id:'sdxl', icon:'⚡', name:'SDXL'}, {id:'flux', icon:'🌊', name:'Flux Schnell'},
  {id:'dreamshaper', icon:'🎨', name:'DreamShaper'}, {id:'lucid', icon:'✨', name:'Lucid'}, {id:'realistic', icon:'📸', name:'Realistic'},
  {id:'anime', icon:'🌸', name:'Anime'}, {id:'fantasy', icon:'🏰', name:'Fantasy'}, {id:'cyberpunk', icon:'🤖', name:'Cyberpunk'},
  {id:'cartoon', icon:'🎭', name:'Cartoon'}, {id:'watercolor', icon:'🖌️', name:'Watercolor'}, {id:'oilpainting', icon:'🖼️', name:'Oil Paint'},
  {id:'pixelart', icon:'👾', name:'Pixel Art'}, {id:'sketch', icon:'✏️', name:'Sketch'}, {id:'scifi', icon:'🌌', name:'Sci-Fi'},
  {id:'horror', icon:'😱', name:'Horror'}, {id:'vintage', icon:'🎪', name:'Vintage'}, {id:'popart', icon:'🎨', name:'Pop Art'}
];

let selectedStyle = 'sdxl';

const styleGrid = document.getElementById('styleGrid');
styles.forEach(s => {
  const card = document.createElement('div');
  card.className = `style-card ${s.id === selectedStyle ? 'selected' : ''}`;
  card.innerHTML = `<span class="emoji">${s.icon}</span>${s.name}`;
  card.onclick = () => {
    document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedStyle = s.id;
  };
  styleGrid.appendChild(card);
});

async function generateImage() {
  const prompt = document.getElementById('imgPrompt').value.trim();
  const negative = document.getElementById('imgNegative').value.trim();
  if (!prompt) return showToast('Please enter a prompt!');
  
  showLoading('imgResult');
  
  try {
    const res = await fetch(`/api/image?style=${selectedStyle}&prompt=${encodeURIComponent(prompt)}&negative_prompt=${encodeURIComponent(negative)}`);
    const data = await res.json();
    const imgUrl = data.url || data.image || data.imageUrl || data.result;
    
    if (imgUrl) {
      document.getElementById('imgResult').innerHTML = `
        <img src="${imgUrl}" class="result-image fade-in" />
        <a href="${imgUrl}" download="AI-Image.png" target="_blank" class="btn-primary" style="max-width:200px;margin:10px auto;">⬇️ Download HD</a>
      `;
    } else {
      throw new Error("No image returned");
    }
  } catch (e) {
    document.getElementById('imgResult').innerHTML = '';
    showToast('Generation Failed: ' + e.message);
  }
}

// ====== TAB 3: DOWNLOADER ====== //
const dlPlatforms = ['auto', 'youtube', 'ytaudio', 'tiktok', 'instagram', 'facebook', 'twitter', 'pinterest', 'spotify', 'threads'];
const dlGrid = document.getElementById('dlPlatforms');
let selectedPlatform = 'auto';

dlPlatforms.forEach(p => {
  const btn = document.createElement('div');
  btn.className = `style-card ${p === selectedPlatform ? 'selected' : ''}`;
  btn.style.padding = '10px 5px';
  btn.innerText = p.charAt(0).toUpperCase() + p.slice(1);
  btn.onclick = () => {
    document.querySelectorAll('#dlPlatforms .style-card').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    selectedPlatform = p;
  };
  dlGrid.appendChild(btn);
});

async function downloadMedia() {
  const url = document.getElementById('dlUrl').value.trim();
  if (!url) return showToast('Please enter a URL!');
  
  showLoading('dlResult');
  
  try {
    const res = await fetch(`/api/downloader?platform=${selectedPlatform}&url=${encodeURIComponent(url)}`);
    const data = await res.json();
    
    let html = `<div class="card fade-in"><h3>Results Found</h3><div style="margin-top:10px;">`;
    
    // Attempt generic parsing to extract media arrays or URLs
    const extractLinks = (obj) => {
      if (typeof obj === 'string' && obj.startsWith('http')) return [obj];
      let links = [];
      for (let k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) links = links.concat(extractLinks(obj[k]));
        else if (typeof obj[k] === 'string' && obj[k].startsWith('http')) links.push(obj[k]);
      }
      return links;
    };
    
    const links = extractLinks(data);
    const uniqueLinks = [...new Set(links)];
    
    if(uniqueLinks.length > 0) {
      uniqueLinks.forEach((l, i) => {
         // show image if it's an image
         if(l.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
             html += `<img src="${l}" style="max-width:150px; border-radius:8px; display:inline-block; margin:5px;"/>`;
         }
         html += `<a href="${l}" target="_blank" class="dl-btn">Download Link ${i+1}</a>`;
      });
    } else {
      html += `<p style="color:var(--error)">No direct download links found. View raw response below:</p><pre style="font-size:11px; overflow:auto; max-height:200px;">${JSON.stringify(data, null, 2)}</pre>`;
    }
    html += `</div></div>`;
    
    document.getElementById('dlResult').innerHTML = html;
  } catch (e) {
    document.getElementById('dlResult').innerHTML = '';
    showToast('Download Fetch Failed: ' + e.message);
  }
}

// ====== TAB 4: TTS ====== //
async function generateTTS() {
  const text = document.getElementById('ttsText').value.trim();
  const voice = document.getElementById('ttsVoice').value;
  const speed = document.getElementById('ttsSpeed').value;
  
  if (!text) return showToast('Enter some text!');
  showLoading('ttsResult');
  
  try {
    const res = await fetch(`/api/tts?voice=${voice}&text=${encodeURIComponent(text)}&speed=${speed}`);
    const data = await res.json();
    
    const audioUrl = data.url || data.audio || data.result;
    if (audioUrl) {
      document.getElementById('ttsResult').innerHTML = `
        <div class="card fade-in">
          <audio controls src="${audioUrl}" style="width:100%; margin-bottom:10px;"></audio>
          <a href="${audioUrl}" download target="_blank" class="btn-primary" style="max-width:200px; margin:0 auto;">⬇️ Download Audio</a>
        </div>
      `;
    } else {
      throw new Error("No audio URL returned");
    }
  } catch (e) {
    document.getElementById('ttsResult').innerHTML = '';
    showToast('TTS Failed: ' + e.message);
  }
}

// ====== TAB 5: ANIME ====== //
function switchAnimeTab(tab) {
  document.getElementById('animeSearchTab').style.display = tab === 'search' ? 'block' : 'none';
  document.getElementById('animeGifTab').style.display = tab === 'gif' ? 'block' : 'none';
  const btns = document.querySelectorAll('.sub-tab-btn');
  btns[0].style.background = tab === 'search' ? 'var(--gradient)' : 'rgba(255,255,255,0.1)';
  btns[1].style.background = tab === 'gif' ? 'var(--gradient)' : 'rgba(255,255,255,0.1)';
}

async function searchAnime() {
  const query = document.getElementById('animeQuery').value.trim();
  if(!query) return showToast('Enter anime title');
  
  showLoading('animeResult');
  try {
    const res = await fetch(`/api/anime?action=search&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const results = data.results || data.data || [];
    
    if(results.length === 0) throw new Error("No results found");
    
    let html = '';
    results.forEach(r => {
      const img = r.image || r.thumbnail || r.poster || 'https://via.placeholder.com/300x400';
      const title = r.title || r.name || 'Unknown';
      const sub = r.status || r.year || '';
      html += `
        <div class="grid-item fade-in" onclick="showToast('Detail view available via API')">
          <img src="${img}" alt="${title}">
          <div class="grid-item-info">
            <div class="grid-item-title">${title}</div>
            <div class="grid-item-sub">${sub}</div>
          </div>
        </div>
      `;
    });
    document.getElementById('animeResult').innerHTML = html;
  } catch (e) {
    document.getElementById('animeResult').innerHTML = `<p>${e.message}</p>`;
  }
}

const gifActions = ['hug', 'slap', 'pat', 'cry', 'dance', 'wink', 'smile', 'happy', 'cuddle', 'blush', 'poke', 'wave', 'bonk', 'yeet'];
const gifGrid = document.getElementById('gifButtonsGrid');
gifActions.forEach(act => {
  const btn = document.createElement('div');
  btn.className = 'gif-btn';
  btn.innerText = act.toUpperCase();
  btn.onclick = async () => {
    showLoading('gifResult');
    try {
      const res = await fetch(`/api/anime?action=${act}`);
      const data = await res.json();
      const url = data.url || data.image || data.result;
      if(url) {
        document.getElementById('gifResult').innerHTML = `<img src="${url}" class="result-image fade-in" />`;
      } else {
        throw new Error("No GIF returned");
      }
    } catch(e) {
      document.getElementById('gifResult').innerHTML = '';
      showToast('Fetch Failed');
    }
  };
  gifGrid.appendChild(btn);
});

// ====== TAB 6: QUIZ GAME ====== //
let quizScore = 0;
let correctAnswer = '';

async function loadQuiz() {
  document.getElementById('startQuizBtn').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'block';
  document.getElementById('nextQuizBtn').style.display = 'none';
  
  const level = document.getElementById('quizLevel').value;
  const type = document.getElementById('quizType').value;
  
  document.getElementById('questionText').innerHTML = 'Loading question...';
  document.getElementById('optionsGrid').innerHTML = '';
  
  try {
    const res = await fetch(`/api/games?type=${type}&level=${level}`);
    const data = await res.json();
    
    const item = data.data || data.result || data;
    const q = item.question || item.text || "What is the answer?";
    const opts = item.options || item.choices || [item.correct, "Wrong A", "Wrong B"].filter(Boolean);
    correctAnswer = item.answer || item.correct || opts[0];
    
    // shuffle options
    opts.sort(() => Math.random() - 0.5);
    
    document.getElementById('questionText').innerText = q;
    const grid = document.getElementById('optionsGrid');
    
    opts.forEach(opt => {
      const btn = document.createElement('div');
      btn.className = 'quiz-option fade-in';
      btn.innerText = opt;
      btn.onclick = () => checkAnswer(btn, opt);
      grid.appendChild(btn);
    });
    
  } catch (e) {
    document.getElementById('questionText').innerText = 'Failed to load question.';
    document.getElementById('startQuizBtn').style.display = 'block';
  }
}

function checkAnswer(btn, selected) {
  if (document.getElementById('nextQuizBtn').style.display === 'block') return; // already answered
  
  const isCorrect = String(selected).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
  
  document.querySelectorAll('.quiz-option').forEach(el => {
    if (String(el.innerText).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim()) {
      el.classList.add('correct');
    } else {
      el.classList.add('wrong');
    }
  });

  if (isCorrect) {
    quizScore++;
    document.getElementById('quizScore').innerText = quizScore;
    showToast('Correct!', 'success');
  } else {
    showToast('Incorrect!');
  }
  
  document.getElementById('nextQuizBtn').style.display = 'block';
}

// ====== TAB 7: MEME CREATOR ====== //
function toggleMemeInputs() {
  const type = document.getElementById('memeType').value;
  if(type === 'meme') {
    document.getElementById('memeInputs').style.display = 'block';
    document.getElementById('singleTextInput').style.display = 'none';
  } else {
    document.getElementById('memeInputs').style.display = 'none';
    document.getElementById('singleTextInput').style.display = 'block';
  }
}

async function generateMeme() {
  const type = document.getElementById('memeType').value;
  let qs = `type=${type}`;
  
  if(type === 'meme') {
    const top = document.getElementById('memeTop').value.trim() || 'TOP TEXT';
    const bot = document.getElementById('memeBottom').value.trim() || 'BOTTOM TEXT';
    qs += `&topText=${encodeURIComponent(top)}&bottomText=${encodeURIComponent(bot)}`;
  } else {
    const txt = document.getElementById('memeSingleText').value.trim() || 'Hello';
    const bg = document.getElementById('memeBg').value;
    const color = document.getElementById('memeColor').value;
    qs += `&text=${encodeURIComponent(txt)}&background=${encodeURIComponent(bg)}&color=${encodeURIComponent(color)}`;
  }
  
  showLoading('memeResult');
  try {
    const res = await fetch(`/api/creator?${qs}`);
    const data = await res.json();
    const url = data.url || data.image || data.result;
    if(url) {
      document.getElementById('memeResult').innerHTML = `
        <img src="${url}" class="result-image fade-in" />
        <a href="${url}" download target="_blank" class="btn-primary" style="max-width:200px; margin:10px auto;">⬇️ Download</a>
      `;
    } else {
      throw new Error("Failed to create image");
    }
  } catch (e) {
    document.getElementById('memeResult').innerHTML = '';
    showToast('Creation Failed: ' + e.message);
  }
}

// ====== TAB 8: MOVIES ====== //
async function searchMovies() {
  const query = document.getElementById('movieQuery').value.trim();
  if(!query) return showToast('Enter movie title');
  
  showLoading('movieResult');
  try {
    const res = await fetch(`/api/movies?action=search&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const results = data.results || data.data || [];
    
    if(results.length === 0) throw new Error("No movies found");
    
    let html = '';
    results.forEach(r => {
      const img = r.image || r.poster || 'https://via.placeholder.com/300x400';
      const title = r.title || r.name || 'Unknown';
      const sub = r.year || r.type || '';
      const url = r.url || r.link || '';
      
      html += `
        <div class="grid-item fade-in" onclick="openMovieDetail('${encodeURIComponent(url)}')">
          <img src="${img}" alt="${title}">
          <div class="grid-item-info">
            <div class="grid-item-title">${title}</div>
            <div class="grid-item-sub">${sub}</div>
          </div>
        </div>
      `;
    });
    document.getElementById('movieResult').innerHTML = html;
  } catch (e) {
    document.getElementById('movieResult').innerHTML = `<p>${e.message}</p>`;
  }
}

async function openMovieDetail(urlEncoded) {
  if(!urlEncoded || urlEncoded === 'undefined') return showToast('No detail URL available');
  
  const modal = document.getElementById('appModal');
  const body = document.getElementById('modalBody');
  modal.style.display = 'block';
  body.innerHTML = '<div class="spinner"></div>';
  
  try {
    const res = await fetch(`/api/movies?action=detail&url=${urlEncoded}`);
    const data = await res.json();
    
    const d = data.result || data.data || data;
    const title = d.title || 'Movie Details';
    const desc = d.description || d.synopsis || 'No description available.';
    const img = d.image || d.poster || '';
    
    let html = `<h2 style="margin-bottom:12px;">${title}</h2>`;
    if(img) html += `<img src="${img}" style="max-width:100%; border-radius:12px; margin-bottom:16px;"/>`;
    html += `<p style="font-size:14px; line-height:1.5; color:var(--text-muted); margin-bottom:20px;">${desc}</p>`;
    
    // Add links if exist
    const links = d.downloadLinks || d.links || [];
    if(links.length > 0) {
      html += `<h3>Download Links</h3><div style="margin-top:10px;">`;
      links.forEach((l, i) => {
        const u = l.url || l.link || l;
        const n = l.name || l.quality || `Link ${i+1}`;
        html += `<a href="${u}" target="_blank" class="dl-btn">${n}</a>`;
      });
      html += `</div>`;
    }
    
    body.innerHTML = html;
  } catch (e) {
    body.innerHTML = `<p style="color:var(--error)">Failed to load details.</p>`;
  }
}

function closeModal() {
  document.getElementById('appModal').style.display = 'none';
}

// Close modal on outside click
window.onclick = function(event) {
  const modal = document.getElementById('appModal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
