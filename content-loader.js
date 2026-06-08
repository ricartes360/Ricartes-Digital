/* ═══════════════════════════════════════════════════
   RICARTES DIGITAL — content-loader.js
   Aplica conteúdo guardado no Firestore às páginas do site
   ═══════════════════════════════════════════════════ */

import { initializeApp }             from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "AIzaSyDlPLPH4_rYqMEFfm8bbReZGZxXET_zYRU",
  authDomain:        "ricartesdigital-786a8.firebaseapp.com",
  projectId:         "ricartesdigital-786a8",
  storageBucket:     "ricartesdigital-786a8.firebasestorage.app",
  messagingSenderId: "659183834991",
  appId:             "1:659183834991:web:d7b0e53f5ad0ca541c3a9a",
};

const app = initializeApp(firebaseConfig, 'content');
const db  = getFirestore(app);

/* innerHTML preserva <em> e <strong> nos títulos editados */
function set(id, val) {
  if (!val) return;
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}

/* ── MÉTODO V.E.R ── */
async function applyVer() {
  try {
    const snap = await getDoc(doc(db, 'conteudo', 'ver'));
    if (!snap.exists()) return;
    const d = snap.data();

    set('ver-hero-sub-text',      d.hero_sub);
    set('ver-hero-btn-text',      d.hero_btn);
    set('ver-desc-1-text',        d.desc_1);
    set('ver-desc-2-text',        d.desc_2);
    set('ver-v-title-text',       d.v_title);
    set('ver-v-desc-text',        d.v_desc);
    set('ver-e-title-text',       d.e_title);
    set('ver-e-desc-text',        d.e_desc);
    set('ver-r-title-text',       d.r_title);
    set('ver-r-desc-text',        d.r_desc);
    set('ver-price-start-text',   d.price_start);
    set('ver-price-pro-text',     d.price_pro);
    set('ver-price-premium-text', d.price_premium);
    set('ver-cta-text-text',      d.cta_text);
    /* Para Quem É */
    set('ver-pq1-title', d.pq1_title);
    set('ver-pq1-desc',  d.pq1_desc);
    set('ver-pq2-title', d.pq2_title);
    set('ver-pq2-desc',  d.pq2_desc);
    set('ver-pq3-title', d.pq3_title);
    set('ver-pq3-desc',  d.pq3_desc);
    /* O que Recebes */
    set('ver-inc1-title', d.inc1_title);
    set('ver-inc1-desc',  d.inc1_desc);
    set('ver-inc2-title', d.inc2_title);
    set('ver-inc2-desc',  d.inc2_desc);
    set('ver-inc3-title', d.inc3_title);
    set('ver-inc3-desc',  d.inc3_desc);
    set('ver-inc4-title', d.inc4_title);
    set('ver-inc4-desc',  d.inc4_desc);
    set('ver-inc5-title', d.inc5_title);
    set('ver-inc5-desc',  d.inc5_desc);
    set('ver-inc6-title', d.inc6_title);
    set('ver-inc6-desc',  d.inc6_desc);
    /* Por Que Escolher */
    set('ver-pc1-title', d.pc1_title);
    set('ver-pc1-desc',  d.pc1_desc);
    set('ver-pc2-title', d.pc2_title);
    set('ver-pc2-desc',  d.pc2_desc);
    set('ver-pc3-title', d.pc3_title);
    set('ver-pc3-desc',  d.pc3_desc);
    /* Grupo VIP */
    set('ver-vip-title', d.vip_title);
    set('ver-vip-desc',  d.vip_desc);
    set('ver-vip-li1',   d.vip_li1);
    set('ver-vip-li2',   d.vip_li2);
    set('ver-vip-li3',   d.vip_li3);
    set('ver-vip-li4',   d.vip_li4);
    set('ver-vip-li5',   d.vip_li5);
  } catch (_) {}
}

/* ── RICARTES CREATIVE ── */
async function applyCreative() {
  try {
    const snap = await getDoc(doc(db, 'conteudo', 'creative'));
    if (!snap.exists()) return;
    const d = snap.data();

    set('cr-hero-sub-text',    d.hero_sub);
    set('cr-hero-btn-text',    d.hero_btn);
    set('cr-sobre-title-text', d.sobre_title);
    set('cr-desc-1-text',      d.desc_1);
    set('cr-desc-2-text',      d.desc_2);
    set('cr-def-1-text',       d.def_1);
    set('cr-def-2-text',       d.def_2);
    set('cr-def-3-text',       d.def_3);
    set('cr-def-4-text',       d.def_4);
    set('cr-def-5-text',       d.def_5);
    set('cr-cta-title-text',   d.cta_title);
    set('cr-cta-sub-text',     d.cta_sub);
    /* Serviços */
    set('cr-srv1-title', d.srv1_title);
    set('cr-srv1-desc',  d.srv1_desc);
    set('cr-srv2-title', d.srv2_title);
    set('cr-srv2-desc',  d.srv2_desc);
    set('cr-srv3-title', d.srv3_title);
    set('cr-srv3-desc',  d.srv3_desc);
    set('cr-srv4-title', d.srv4_title);
    set('cr-srv4-desc',  d.srv4_desc);
  } catch (_) {}
}

/* ── SOBRE ── */
async function applySobre() {
  try {
    const snap = await getDoc(doc(db, 'conteudo', 'sobre'));
    if (!snap.exists()) return;
    const d = snap.data();

    set('sob-nome-text',      d.nome);
    set('sob-role-text',      d.role);
    set('sob-img-role-text',  d.img_role);
    set('sob-bio-1-text',     d.bio_1);
    set('sob-bio-2-text',     d.bio_2);
    set('sob-bio-3-text',     d.bio_3);
    set('sob-esp-1-text',     d.esp_1);
    set('sob-esp-2-text',     d.esp_2);
    set('sob-esp-3-text',     d.esp_3);
    set('sob-esp-4-text',     d.esp_4);
    set('sob-esp-5-text',     d.esp_5);
    set('sob-esp-6-text',     d.esp_6);
    set('sob-gal-title-text', d.gal_title);
    set('sob-gal-sub-text',   d.gal_sub);
    /* O que Faço */
    set('sob-af1-title', d.af1_title);
    set('sob-af1-desc',  d.af1_desc);
    set('sob-af2-title', d.af2_title);
    set('sob-af2-desc',  d.af2_desc);
    set('sob-af3-title', d.af3_title);
    set('sob-af3-desc',  d.af3_desc);
  } catch (_) {}
}

applyVer();
applyCreative();
applySobre();
