/* ═══════════════════════════════════════════════════
   RICARTES DIGITAL — script.js  (type="module")
   ═══════════════════════════════════════════════════ */

import { loadPortfolioImages, loadCreativeImages, loadInstagramImages } from './firebase-images.js';

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. PRELOADER ──────────────────────────────── */
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    if (preloader) {
      preloader.classList.add('done');
      setTimeout(() => preloader.remove(), 650);
    }
    document.body.classList.add('loaded');
  }, 1000);

  /* ── 1. CUSTOM CURSOR ──────────────────────────── */
  const cur     = document.getElementById('cur');
  const curRing = document.getElementById('cur-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    curRing.style.left = rx + 'px';
    curRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .pitem, .feature-card, .mcard, .module-card, .srv-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-big'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-big'));
  });


  /* ── 2. SPA NAVIGATION ─────────────────────────── */
  const PAGES = {
    'home':         'page-home',
    'mentorias':    'page-mentorias',
    'programacao':  'page-programacao',
    'portfolio':    'page-portfolio',
    'creative':     'page-creative',
    'sobre':        'page-sobre',
  };

  function getPageFromHash() {
    const hash = window.location.hash.replace('#', '') || 'home';
    return PAGES[hash] ? hash : 'home';
  }

  /* ── 5. SCROLL REVEAL (declarado antes de navigateTo) ── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        entry.target.classList.remove('animating');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

  function triggerReveal(container) {
    container.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('animating');
      el.classList.add('in');
    });
    setTimeout(() => {
      container.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.92) {
          el.classList.remove('in');
          el.classList.add('animating');
          revealObserver.observe(el);
        }
      });
    }, 60);
    setTimeout(() => {
      container.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('in');
        el.classList.remove('animating');
      });
    }, 1500);
  }

  /* ── 6. COUNTERS (declarado antes de navigateTo) ── */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  function animCounter(el) {
    const target = parseInt(el.dataset.n);
    const sfx    = el.dataset.sfx || '';
    let n = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      n += step;
      if (n >= target) { el.textContent = target + sfx; clearInterval(timer); }
      else el.textContent = Math.floor(n) + sfx;
    }, 18);
  }

  function triggerCounters(container) {
    container.querySelectorAll('.stat-n[data-n]').forEach(el => {
      el.textContent = '0';
      counterObserver.observe(el);
    });
  }

  function navigateTo(pageKey, pushState = true) {
    const targetId = PAGES[pageKey];
    if (!targetId) return;

    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.querySelectorAll('.anim-up').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = '';
      });
    });

    const target = document.getElementById(targetId);
    if (!target) return;
    target.classList.add('active', 'entering');
    setTimeout(() => target.classList.remove('entering'), 600);

    window.scrollTo({ top: 0, behavior: 'instant' });

    if (pushState) history.pushState({ page: pageKey }, '', '#' + pageKey);

    updateNavActive(pageKey);
    triggerReveal(target);

    if (pageKey === 'home' || pageKey === 'sobre' || pageKey === 'creative') triggerCounters(target);

    if (pageKey === 'portfolio') {
      loadPortfolioImages().then(() => triggerReveal(target));
    }
    if (pageKey === 'creative') {
      loadCreativeImages().then(() => triggerReveal(target));
    }
  }

  function updateNavActive(pageKey) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const lp = link.dataset.page;
      link.classList.toggle('active',
        lp === pageKey ||
        (pageKey === 'programacao' && lp === 'mentorias')
      );
    });
  }

  /* ── 3. MOBILE HAMBURGER ───────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    const pageKey = link.dataset.page;
    if (!PAGES[pageKey]) return;
    e.preventDefault();
    navigateTo(pageKey);
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });

  window.addEventListener('popstate', e => {
    navigateTo(e.state?.page || getPageFromHash(), false);
  });

  navigateTo(getPageFromHash(), false);


  /* ── 4. NAVBAR SCROLL ──────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  triggerCounters(document.getElementById('page-home'));


  /* ── 7. TICKER ─────────────────────────────────── */
  document.querySelectorAll('.ticker-track').forEach(track => {
    if (track.dataset.duped) return;
    track.parentElement.appendChild(track.cloneNode(true));
    track.dataset.duped = '1';
  });


  /* ── 8. PORTFOLIO FILTERS ──────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.fbtn');
    if (!btn) return;
    const grid = btn.closest('.section')?.querySelector('#portfolio-grid') ||
                 btn.closest('.section')?.querySelector('.masonry');
    if (!grid) return;
    btn.closest('.filters').querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    grid.querySelectorAll('.pitem').forEach(item => {
      const show = f === 'all' || item.dataset.cat === f;
      item.style.opacity      = show ? '1' : '0.12';
      item.style.transform    = show ? '' : 'scale(0.97)';
      item.style.transition   = 'opacity .4s, transform .4s';
      item.style.pointerEvents = show ? 'auto' : 'none';
    });
  });


  /* ── 9. HERO BLOB PARALLAX ─────────────────────── */
  const blobs = document.querySelectorAll('.hero-blob');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    blobs.forEach((b, i) => {
      b.style.transform = `translateY(${y * (0.08 + i * 0.04)}px)`;
    });
  }, { passive: true });


  /* ── 10. FORMULÁRIO MÉTODO V.E.R ──────────────── */
  const verForm = document.getElementById('ver-form');
  if (verForm) {
    verForm.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = verForm.querySelectorAll('input, select, textarea');
      const nome     = inputs[0].value.trim();
      const telefone = inputs[1].value.trim();
      const email    = inputs[2].value.trim();
      const cidade   = inputs[3].value.trim();
      const area     = inputs[4].value;
      const objetivo = inputs[5].value.trim();

      const msg =
        `Olá! Quero garantir a minha vaga no *Método V.E.R* 🚀\n\n` +
        `*Nome:* ${nome}\n` +
        `*Telefone:* ${telefone}\n` +
        `*Email:* ${email}\n` +
        `*Cidade:* ${cidade}\n` +
        `*Área de Interesse:* ${area}\n` +
        `*Objectivo:* ${objetivo}`;

      window.open('https://wa.me/244929395774?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  /* ── 11. SPOTLIGHT NOS CARTÕES ─────────────────── */
  document.querySelectorAll('.feature-card, .mcard:not(.mcard-soon), .srv-card, .prog-card')
    .forEach(card => {
      const spot = document.createElement('span');
      spot.className = 'card-spot';
      card.appendChild(spot);
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      });
    });

  /* ── 12. INSTAGRAM FEED ────────────────────────── */
  loadInstagramImages();

  /* ── 13. CONSOLE WATERMARK ─────────────────────── */
  console.log('%c✦ Ricartes Digital',
    'font-size:18px;font-weight:800;color:#F5D000;background:#080808;padding:8px 16px;border-radius:4px;');
  console.log('%cEcossistema criativo · Angola',
    'font-size:12px;color:#666;padding:2px 16px;');

});