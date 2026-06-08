/* ═══════════════════════════════════════════════════
   RICARTES DIGITAL — firebase-images.js
   ═══════════════════════════════════════════════════ */

import { initializeApp }             from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection,
         getDocs, query, where }     from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "AIzaSyDlPLPH4_rYqMEFfm8bbReZGZxXET_zYRU",
  authDomain:        "ricartesdigital-786a8.firebaseapp.com",
  projectId:         "ricartesdigital-786a8",
  storageBucket:     "ricartesdigital-786a8.firebasestorage.app",
  messagingSenderId: "659183834991",
  appId:             "1:659183834991:web:d7b0e53f5ad0ca541c3a9a",
  measurementId:     "G-QWS9F35BT6"
};

const app = initializeApp(firebaseConfig, 'site');
const db  = getFirestore(app);

/* cache para não repetir queries */
const _cache = {};

async function fetchImages(section) {
  if (_cache[section]) return _cache[section];
  try {
    const snap = await getDocs(query(
      collection(db, 'imagens'),
      where('section', '==', section)
    ));
    _cache[section] = snap.docs.map(d => d.data());
  } catch (err) {
    console.warn('[firebase-images]', err.message);
    _cache[section] = [];
  }
  return _cache[section];
}

function buildItem(img, extra = '') {
  const item = document.createElement('div');
  const cat  = img.category || 'Geral';
  const hasInfo = img.title || img.client || img.desc;
  item.className   = 'pitem reveal in';
  item.dataset.cat = cat.toLowerCase().replace(/\s+/g, '-');
  item.innerHTML   = `
    <div class="pitem-img-wrap">
      <img src="${img.url}" alt="${img.alt || img.title}" loading="lazy" />
      <div class="pitem-over">
        <p class="pcat">${cat}</p>
        <p class="pname">${img.title}</p>
      </div>
    </div>
    ${hasInfo ? `
    <div class="pitem-info">
      <p class="pitem-info-cat">${cat}${img.year ? ' · ' + img.year : ''}</p>
      <p class="pitem-info-title">${img.title}</p>
      ${img.client ? `<p class="pitem-info-client">${img.client}</p>` : ''}
      ${img.desc   ? `<p class="pitem-info-desc">${img.desc}</p>`     : ''}
    </div>` : ''}
    ${extra}`;
  return item;
}

/* ── Portfólio ── */
export async function loadPortfolioImages() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  const imgs = await fetchImages('portfolio');
  if (!imgs.length) return;
  grid.innerHTML = '';
  imgs.forEach(img => grid.appendChild(buildItem(img)));
}

/* ── Creative ── */
export async function loadCreativeImages() {
  const masonry = document.querySelector('#page-creative .masonry');
  if (!masonry) return;
  const imgs = await fetchImages('creative');
  if (!imgs.length) return;
  masonry.innerHTML = '';
  imgs.forEach(img => masonry.appendChild(buildItem(img)));
}