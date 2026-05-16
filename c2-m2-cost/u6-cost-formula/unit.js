/* ===========================================
   Unit 6 · 成本预估公式 — Formula Builder
   =========================================== */
(() => {
  'use strict';

  const sliders = {
    dau: document.getElementById('fw-dau'),
    freq: document.getElementById('fw-freq'),
    inTok: document.getElementById('fw-in-tok'),
    outTok: document.getElementById('fw-out-tok'),
    cache: document.getElementById('fw-cache'),
  };

  const vals = {
    dau: document.getElementById('fw-dau-val'),
    freq: document.getElementById('fw-freq-val'),
    inTok: document.getElementById('fw-in-tok-val'),
    outTok: document.getElementById('fw-out-tok-val'),
    cache: document.getElementById('fw-cache-val'),
  };

  const resultEl = document.getElementById('fw-result');

  const MODELS = [
    { name: 'DeepSeek V4 Flash', input: 0.14, output: 0.28, cachedInput: 0.0028 },
    { name: 'Claude Sonnet 4.6', input: 3.00, output: 15.00, cachedInput: 0.30 },
    { name: 'Claude Opus 4.7', input: 5.00, output: 25.00, cachedInput: 0.50 },
  ];

  function update() {
    if (!sliders.dau || !resultEl) return;

    const dau = parseInt(sliders.dau.value);
    const freq = parseInt(sliders.freq.value);
    const inTok = parseInt(sliders.inTok.value);
    const outTok = parseInt(sliders.outTok.value);
    const cacheRate = parseInt(sliders.cache.value) / 100;

    vals.dau.textContent = dau.toLocaleString();
    vals.freq.textContent = freq;
    vals.inTok.textContent = inTok;
    vals.outTok.textContent = outTok;
    vals.cache.textContent = Math.round(cacheRate * 100) + '%';

    const dailyCalls = dau * freq;
    const monthCalls = dailyCalls * 30;

    let html = '<div class="fw-result-label">月成本估算 (30 天)</div>';
    html += '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:10px; margin-top:12px;">';

    MODELS.forEach(m => {
      const cachedIn = inTok * cacheRate;
      const uncachedIn = inTok * (1 - cacheRate);
      const inputCost = (cachedIn / 1e6 * m.cachedInput + uncachedIn / 1e6 * m.input) * monthCalls;
      const outputCost = (outTok / 1e6 * m.output) * monthCalls;
      const total = inputCost + outputCost;

      const fmt = total < 1 ? '$' + total.toFixed(2) : '$' + Math.round(total).toLocaleString();
      const cny = total < 1 ? '¥' + (total * 7.2).toFixed(1) : '¥' + Math.round(total * 7.2).toLocaleString();

      html += `
        <div style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
          <div style="font-size:12px; font-weight:600; color:var(--ink-muted);">${m.name}</div>
          <span class="fw-result-val" style="font-size:28px;">${fmt}</span>
          <div class="fw-result-detail">${cny} &middot; ${monthCalls.toLocaleString()} 次/月</div>
        </div>
      `;
    });

    html += '</div>';
    resultEl.innerHTML = html;
  }

  Object.values(sliders).forEach(s => {
    if (s) s.addEventListener('input', update);
  });
  update();
})();
