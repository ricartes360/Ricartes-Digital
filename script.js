/* ═══════════════════════════════════════════════════
   RICARTES DIGITAL — script.js (FIXED)
══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CUSTOM CURSOR ──────────────────────────── */
  const cur = document.getElementById('cur');
  const curRing = document.getElementById('cur-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    curRing.style.left = rx + 'px';
    curRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .pitem, .feature-card, .mcard, .module-card, .srv-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-big'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-big'));
    });


  /* ── 2. SPA NAVIGATION ─────────────────────────── */
  const PAGES = {
    home: 'page-home',
    mentorias: 'page-mentorias',
    'zero-digital': 'page-zero-digital',
    'design-start': 'page-design-start',
    programacao: 'page-programacao',
    portfolio: 'page-portfolio',
    creative: 'page-creative',
  };

  function getPageFromHash() {
    const hash = window.location.hash.replace('#', '') || 'home';
    return PAGES[hash] ? hash : 'home';
  }

  function updateNavActive(pageKey) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const lp = link.dataset.page;
      link.classList.toggle(
        'active',
        lp === pageKey ||
        (pageKey === 'zero-digital' && lp === 'mentorias') ||
        (pageKey === 'design-start' && lp === 'mentorias') ||
        (pageKey === 'programacao' && lp === 'mentorias')
      );
    });
  }

  function navigateTo(pageKey, pushState = true) {
    const targetId = PAGES[pageKey];
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');

      p.querySelectorAll('.anim-up').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = '';
      });
    });

    target.classList.add('active');
    target.classList.add('entering');

    setTimeout(() => target.classList.remove('entering'), 600);

    window.scrollTo({ top: 0 });

    if (pushState) {
      history.pushState({ page: pageKey }, '', '#' + pageKey);
    }

    updateNavActive(pageKey);

    setTimeout(() => {
      triggerReveal(target);
    }, 100);

    if (pageKey === 'home') {
      triggerCounters(target);
    }
  }


  /* ── 3. MOBILE MENU (IMPORTANTE: ANTES DO CLICK) ── */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });


  /* ── 4. NAV CLICK ─────────────────────────────── */
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


  /* ── 5. BACK/FORWARD ───────────────────────────── */
  window.addEventListener('popstate', e => {
    const pageKey = e.state?.page || getPageFromHash();
    navigateTo(pageKey, false);
  });


  /* ── 6. INITIAL LOAD ───────────────────────────── */
  navigateTo(getPageFromHash(), false);


  /* ── 7. NAV SCROLL ─────────────────────────────── */
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  /* ── 8. REVEAL ─────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  });

  function triggerReveal(container) {
    container.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('in');
      revealObserver.observe(el);
    });
  }


  /* ── 9. COUNTERS ──────────────────────────────── */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  });

  function animCounter(el) {
    const target = parseInt(el.dataset.n);
    const sfx = el.dataset.sfx || '';
    let n = 0;

    const step = target / 60;

    const timer = setInterval(() => {
      n += step;

      if (n >= target) {
        el.textContent = target + sfx;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(n) + sfx;
      }
    }, 18);
  }

  function triggerCounters(container) {
    container.querySelectorAll('.stat-n[data-n]').forEach(el => {
      el.textContent = '0';
      counterObserver.observe(el);
    });
  }


  /* ── 10. TICKER ──────────────────────────────── */
  document.querySelectorAll('.ticker-track').forEach(track => {
    if (track.dataset.duped) return;
    track.parentElement.appendChild(track.cloneNode(true));
    track.dataset.duped = '1';
  });


  /* ── 11. PORTFOLIO FILTER ─────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.fbtn');
    if (!btn) return;

    const grid = document.querySelector('.masonry');
    if (!grid) return;

    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const f = btn.dataset.f;

    grid.querySelectorAll('.pitem').forEach(item => {
      const show = f === 'all' || item.dataset.cat === f;
      item.style.opacity = show ? '1' : '0.15';
      item.style.pointerEvents = show ? 'auto' : 'none';
    });
  });


  /* ── 12. PARALLAX ─────────────────────────────── */
  const blobs = document.querySelectorAll('.hero-blob');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    blobs.forEach((b, i) => {
      b.style.transform = `translateY(${y * (0.08 + i * 0.04)}px)`;
    });
  });


  /* ── CONSOLE ─────────────────────────────────── */
  console.log('%c✦ Ricartes Digital', 'font-size:18px;font-weight:800;color:#F5D000;background:#080808;padding:8px 16px;border-radius:4px;');
});