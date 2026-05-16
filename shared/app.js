/* ===========================================
   AI for PM · Shared interactive layer
   ===========================================
   Reusable across all units. Each block guards
   on its DOM anchors — only initializes if the
   relevant elements exist on the page.

   Owns:
   - Theme toggle (light/dark, persists)
   - Scroll progress bar
   - Step rail active state
   - Probability bars: animate widths on enter
   - Rough.js sketchy borders
   - Smooth-scroll polyfill
*/

(() => {
  'use strict';

  // -----------------------------
  // 1. Theme toggle
  // -----------------------------
  const root = document.body;
  const toggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'aipm-theme';

  // Initial: localStorage > prefers-color-scheme > light
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefers ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  // -----------------------------
  // 2. Scroll progress + active step
  // -----------------------------
  const progressFill = document.getElementById('progress-fill');
  const railLinks = document.querySelectorAll('.step-rail a');
  const steps = document.querySelectorAll('.step');

  if (progressFill && steps.length) {
    function onScroll() {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.max(0, Math.min(100, (window.scrollY / docH) * 100));
      progressFill.style.width = pct + '%';

      const target = window.innerHeight * 0.3;
      let activeIdx = 0;
      let bestDist = Infinity;
      steps.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const dist = Math.abs(r.top - target);
        if (r.top < window.innerHeight * 0.6 && dist < bestDist) {
          bestDist = dist;
          activeIdx = i;
        }
      });

      railLinks.forEach((a, i) => {
        a.classList.toggle('active', i === activeIdx);
      });
    }

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => { onScroll(); scrollTicking = false; });
        scrollTicking = true;
      }
    }, { passive: true });
    onScroll();
  }

  // -----------------------------
  // 3. Probability bars — animate when in view
  // -----------------------------
  const bars = document.querySelectorAll('.bar[data-value]');
  if (bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const bar = e.target;
          const v = parseFloat(bar.dataset.value || '0');
          bar.style.width = v + '%';
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => barObserver.observe(b));
  }

  // -----------------------------
  // 4. Rough.js — sketchy borders on key elements
  // -----------------------------
  if (window.rough) {
    const sketchTargets = document.querySelectorAll('.truth-bubble, .big-insight, .one-liner, .end-summary');

    if (sketchTargets.length) {
      function drawRoughBorder(el) {
        el.querySelectorAll('.rough-bg').forEach(s => s.remove());

        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (w === 0 || h === 0) return;

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'rough-bg');
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '0';
        svg.style.overflow = 'visible';

        const rc = rough.svg(svg);
        const cs = getComputedStyle(el);
        const stroke = cs.borderTopColor || '#1e1e1e';

        const node = rc.rectangle(3, 3, w - 6, h - 6, {
          stroke: stroke,
          strokeWidth: 2.5,
          roughness: 1.6,
          bowing: 1.5,
          fill: 'none'
        });
        svg.appendChild(node);

        if (getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
        }
        [...el.children].forEach(c => {
          if (c.classList && !c.classList.contains('rough-bg')) {
            c.style.position = c.style.position || 'relative';
            c.style.zIndex = c.style.zIndex || '1';
          }
        });

        el.style.borderColor = 'transparent';
        el.insertBefore(svg, el.firstChild);
      }

      function drawAllRough() {
        sketchTargets.forEach(drawRoughBorder);
      }

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => requestAnimationFrame(drawAllRough));
      } else {
        window.addEventListener('load', drawAllRough);
      }

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(drawAllRough, 200);
      });

      const themeObserver = new MutationObserver(() => {
        requestAnimationFrame(drawAllRough);
      });
      themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }

  // -----------------------------
  // 5. Smooth-scroll polyfill for older Safari
  // -----------------------------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

})();
