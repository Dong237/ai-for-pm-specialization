/* ===========================================
   AI for PM · Unit 1 · Interactive layer
   ===========================================
   Owns:
   - Theme toggle (light/dark, persists)
   - Scroll progress bar
   - Step rail active state
   - Probability bars: animate widths on enter
   - Autoregressive demo: click-to-advance token generation
   - Temperature slider: shows different outputs
*/

(() => {
  'use strict';

  // -----------------------------
  // 1. Theme toggle
  // -----------------------------
  const root = document.body;
  const toggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'u1-theme';

  // Initial: localStorage > prefers-color-scheme > light
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefers ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    // Update theme-color meta for iOS status bar
    const metaLight = document.querySelector('meta[name="theme-color"][media*="light"]');
    const metaDark = document.querySelector('meta[name="theme-color"][media*="dark"]');
    if (metaLight) metaLight.setAttribute('content', next === 'light' ? '#fefcf7' : '#1a1a24');
  });

  // -----------------------------
  // 2. Scroll progress + active step
  // -----------------------------
  const progressFill = document.getElementById('progress-fill');
  const railLinks = document.querySelectorAll('.step-rail a');
  const steps = document.querySelectorAll('.step');

  function onScroll() {
    // Progress bar (overall)
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.max(0, Math.min(100, (window.scrollY / docH) * 100));
    progressFill.style.width = pct + '%';

    // Find which step is currently in view (closest to top 30%)
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

  // -----------------------------
  // 3. Probability bars — animate when in view
  // -----------------------------
  const bars = document.querySelectorAll('.bar');
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

  // -----------------------------
  // 4. Autoregressive demo
  // -----------------------------
  // Model "predicts" next token given a context.
  // We hardcode the natural sequence: "今天天气真" → "好,我们去公园走走吧."
  const arRounds = [
    { pick: '好',  alts: [['好', 60], ['棒', 20], ['不错', 8], ['糟', 5], ['闷', 3]] },
    { pick: ',',   alts: [[',', 70], ['!', 12], ['.', 8], ['呢', 5]] },
    { pick: '我们', alts: [['我们', 38], ['一', 15], ['真', 10], ['今天', 9]] },
    { pick: '去',  alts: [['去', 52], ['出', 18], ['一起', 12], ['出门', 8]] },
    { pick: '公园', alts: [['公园', 32], ['外面', 14], ['野餐', 9], ['爬山', 7]] },
    { pick: '走走', alts: [['走走', 28], ['玩', 18], ['散步', 16]] },
    { pick: '吧',  alts: [['吧', 42], ['呗', 12], ['~', 8]] },
    { pick: '.',   alts: [['.', 65], ['!', 18], ['呀', 4]] },
  ];

  const arDisplay = document.getElementById('ar-generated');
  const arRoundsEl = document.getElementById('ar-rounds');
  const arCount = document.getElementById('ar-count');
  const arStepBtn = document.getElementById('ar-step');
  const arResetBtn = document.getElementById('ar-reset');

  let arIdx = 0;
  function arRender() {
    arCount.textContent = arIdx;
    if (arIdx >= arRounds.length) {
      arStepBtn.textContent = '生成完毕 ✓';
      arStepBtn.disabled = true;
    } else {
      arStepBtn.textContent = '下一轮 →';
      arStepBtn.disabled = false;
    }
  }
  function arStep() {
    if (arIdx >= arRounds.length) return;
    const r = arRounds[arIdx];
    // Append token
    const span = document.createElement('span');
    span.className = 'ar-token';
    span.textContent = r.pick;
    arDisplay.appendChild(span);
    // Append round summary
    const round = document.createElement('div');
    round.className = 'ar-round';
    const altsTxt = r.alts.slice(0, 3).map(a => `${a[0]} ${a[1]}%`).join(' · ');
    round.innerHTML = `<span class="round-num">轮 ${arIdx + 1}</span>候选 [${altsTxt}] → 选 <span class="round-pick">"${r.pick}"</span>`;
    arRoundsEl.appendChild(round);
    arIdx++;
    arRender();
  }
  function arReset() {
    arIdx = 0;
    arDisplay.innerHTML = '';
    arRoundsEl.innerHTML = '';
    arRender();
  }
  arStepBtn.addEventListener('click', arStep);
  arResetBtn.addEventListener('click', arReset);
  arRender();

  // -----------------------------
  // 5. Temperature slider
  // -----------------------------
  const tempSlider = document.getElementById('temp-slider');
  const tempValue = document.getElementById('temp-value');
  const tempWords = document.getElementById('temp-words');
  const tempExplain = document.getElementById('temp-explain');

  // For each temp range, a different sample output + explanation
  // (illustrative, not a real model — but realistic of behavior)
  const tempPresets = [
    { max: 0.1,  word: '好.',                   note: 'T=0 时, AI 永远输出 top 候选 "好". 同一句问 100 次, 结果完全一样. 适合医疗 / 法律 / 健康建议.' },
    { max: 0.4,  word: '好.',                   note: 'T=0.2-0.3 时, 偶尔会出 "棒". 99% 的情况还是 "好". 健康产品默认值.' },
    { max: 0.8,  word: '不错!',                 note: 'T=0.7 是默认值. 概率分布按原样采样, 出 "好" 是大概率, 偶尔 "棒" "不错". 自然中带变化.' },
    { max: 1.0,  word: '好得很!',               note: 'T=0.9 已经放飞了. 会出现训练时少见的搭配. 适合写文案 / 起名.' },
    { max: 1.3,  word: '好得不像话, 简直 ...',   note: 'T=1.2 拉平概率. 低概率词被放大, 偶有惊喜也偶有崩坏. 写诗写故事可以试.' },
    { max: 99,   word: '好? 棒? 不! 是惊魂!',    note: 'T>1.4 完全狂野. 输出经常不连贯. 不适合产品, 适合炫技 demo.' },
  ];

  function updateTemp() {
    const raw = parseInt(tempSlider.value, 10);  // 0..15
    const t = raw / 10;                          // 0..1.5
    tempValue.textContent = t.toFixed(1);

    const preset = tempPresets.find(p => t <= p.max) || tempPresets[tempPresets.length - 1];
    // Animate the swap
    tempWords.classList.remove('swap-word');
    void tempWords.offsetWidth;  // force reflow to restart animation
    tempWords.classList.add('swap-word');
    tempWords.textContent = preset.word;
    tempExplain.textContent = preset.note;
  }
  tempSlider.addEventListener('input', updateTemp);
  updateTemp();

  // -----------------------------
  // 6. Rough.js — sketchy borders on key elements
  // -----------------------------
  // We use rough.js sparingly for the *most prominent* boxes — it's expensive to do for everything,
  // and CSS borders + tilts already give us 80% of the look.
  // Targeted: the truth-bubble, the big-insight, the one-liner, the end-summary.
  if (window.rough) {
    const sketchTargets = document.querySelectorAll('.truth-bubble, .big-insight, .one-liner, .end-summary');

    function drawRoughBorder(el) {
      // Remove any prior svg
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

      // Read computed border color from the element
      const cs = getComputedStyle(el);
      const stroke = cs.borderTopColor || '#1e1e1e';

      // Hand-drawn rectangle with hachure-like roughness
      const node = rc.rectangle(3, 3, w - 6, h - 6, {
        stroke: stroke,
        strokeWidth: 2.5,
        roughness: 1.6,
        bowing: 1.5,
        fill: 'none'
      });
      svg.appendChild(node);

      // Make sure container is positioned and content sits above the SVG
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      // Wrap children in a z-indexed layer
      [...el.children].forEach(c => {
        if (c.classList && !c.classList.contains('rough-bg')) {
          c.style.position = c.style.position || 'relative';
          c.style.zIndex = c.style.zIndex || '1';
        }
      });

      // Hide the CSS border since rough.js draws one
      el.style.borderColor = 'transparent';

      el.insertBefore(svg, el.firstChild);
    }

    function drawAllRough() {
      sketchTargets.forEach(drawRoughBorder);
    }

    // Initial draw, after fonts load + layout settles
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(drawAllRough));
    } else {
      window.addEventListener('load', drawAllRough);
    }

    // Redraw on resize (debounced) and on theme change
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

  // -----------------------------
  // 7. Smooth-scroll polyfill for older Safari
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
