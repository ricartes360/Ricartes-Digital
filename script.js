/* ═══════════════════════════════════════════════════
   RICARTES DIGITAL — script.js
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

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
    'zero-digital': 'page-zero-digital',
    'design-start': 'page-design-start',
    'programacao':  'page-programacao',
    'portfolio':    'page-portfolio',
    'creative':     'page-creative',
  };

  function getPageFromHash() {
    const hash = window.location.hash.replace('#', '') || 'home';
    return PAGES[hash] ? hash : 'home';
  }

  function navigateTo(pageKey, pushState = true) {
    const targetId = PAGES[pageKey];
    if (!targetId) return;

    // Hide all pages & remove active (stops anim-up on hidden pages)
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      // Reset anim-up so they replay on re-visit
      p.querySelectorAll('.anim-up').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // force reflow
        el.style.animation = '';
      });
    });

    // Show target
    const target = document.getElementById(targetId);
    if (!target) return;
    target.classList.add('active');
    target.classList.add('entering');
    setTimeout(() => target.classList.remove('entering'), 600);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update URL
    if (pushState) {
      history.pushState({ page: pageKey }, '', '#' + pageKey);
    }

    // Update nav active state
    updateNavActive(pageKey);

    // Re-trigger reveal animations for new page
    triggerReveal(target);

    // Re-trigger counters if navigating to home
    if (pageKey === 'home') {
      triggerCounters(target);
    }
  }

  function updateNavActive(pageKey) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const lp = link.dataset.page;
      link.classList.toggle('active', lp === pageKey || (pageKey === 'zero-digital' && lp === 'mentorias') || (pageKey === 'design-start' && lp === 'mentorias') || (pageKey === 'programacao' && lp === 'mentorias'));
    });
  }

  // Handle all nav clicks
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    const pageKey = link.dataset.page;
    if (!PAGES[pageKey]) return;
    e.preventDefault();
    navigateTo(pageKey);
    // Close mobile menu
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });

  // Handle browser back/forward
  window.addEventListener('popstate', e => {
    const pageKey = e.state?.page || getPageFromHash();
    navigateTo(pageKey, false);
  });

  // Initial load
  const initialPage = getPageFromHash();
  navigateTo(initialPage, false);


  /* ── 3. MOBILE HAMBURGER ───────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });


  /* ── 4. NAVBAR SCROLL STYLE ────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  /* ── 5. SCROLL REVEAL ──────────────────────────── */
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
    // STEP 1: Everything starts visible (no blank pages ever)
    container.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('animating');
      el.classList.add('in');
    });

    // STEP 2: Only elements below viewport get scroll animation
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

    // STEP 3: Absolute failsafe after 1.5s
    setTimeout(() => {
      container.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('in');
        el.classList.remove('animating');
      });
    }, 1500);
  }


  /* ── 6. COUNTERS ───────────────────────────────── */
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

  // Always init counters on home page
  triggerCounters(document.getElementById('page-home'));


  /* ── 7. TICKER DUPLICATE ───────────────────────── */
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
      item.style.opacity   = show ? '1' : '0.12';
      item.style.transform = show ? '' : 'scale(0.97)';
      item.style.transition = 'opacity .4s, transform .4s';
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


  /* ── 10. CONSOLE WATERMARK ─────────────────────── */
  console.log(
    '%c✦ Ricartes Digital',
    'font-size:18px;font-weight:800;color:#F5D000;background:#080808;padding:8px 16px;border-radius:4px;'
  );
  console.log(
    '%cEcossistema criativo · Angola',
    'font-size:12px;color:#666;padding:2px 16px;'
  );

});
