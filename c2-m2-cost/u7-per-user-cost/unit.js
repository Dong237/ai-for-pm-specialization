/* ===========================================
   Unit 7 · Per-User 月成本测算 — Per-User Calculator
   =========================================== */
(() => {
  'use strict';

  const MODELS = [
    { name: 'DS V4 Flash', input: 0.14, output: 0.28, cached: 0.0028, color: '#4a9eed' },
    { name: 'Claude Sonnet', input: 3.00, output: 15.00, cached: 0.30, color: '#f59e0b' },
    { name: 'Claude Opus', input: 5.00, output: 25.00, cached: 0.50, color: '#ef4444' },
  ];

  const s = {
    dau: document.getElementById('pu-dau'),
    freq: document.getElementById('pu-freq'),
    inTok: document.getElementById('pu-in'),
    outTok: document.getElementById('pu-out'),
    cache: document.getElementById('pu-cache'),
    route: document.getElementById('pu-route'),
  };
  const v = {
    dau: document.getElementById('pu-dau-v'),
    freq: document.getElementById('pu-freq-v'),
    inTok: document.getElementById('pu-in-v'),
    outTok: document.getElementById('pu-out-v'),
    cache: document.getElementById('pu-cache-v'),
    route: document.getElementById('pu-route-v'),
  };
  const resultEl = document.getElementById('pu-result');

  function update() {
    if (!s.dau || !resultEl) return;
    const dau = parseInt(s.dau.value);
    const freq = parseInt(s.freq.value);
    const inTok = parseInt(s.inTok.value);
    const outTok = parseInt(s.outTok.value);
    const cacheR = parseInt(s.cache.value) / 100;
    const routeR = parseInt(s.route.value) / 100; // % going to cheap model

    v.dau.textContent = dau.toLocaleString();
    v.freq.textContent = freq;
    v.inTok.textContent = inTok;
    v.outTok.textContent = outTok;
    v.cache.textContent = Math.round(cacheR * 100) + '%';
    v.route.textContent = Math.round(routeR * 100) + '%';

    const callsPerUser = freq * 30;
    const totalCalls = dau * callsPerUser;

    // With routing: routeR% goes to cheap model (DS Flash), rest to Sonnet
    const cheapModel = MODELS[0];
    const midModel = MODELS[1];

    const calcCost = (m, calls) => {
      const cachedIn = inTok * cacheR;
      const uncachedIn = inTok * (1 - cacheR);
      const inCost = (cachedIn / 1e6 * m.cached + uncachedIn / 1e6 * m.input) * calls;
      const outCost = (outTok / 1e6 * m.output) * calls;
      return inCost + outCost;
    };

    const cheapCalls = totalCalls * routeR;
    const midCalls = totalCalls * (1 - routeR);
    const routedTotal = calcCost(cheapModel, cheapCalls) + calcCost(midModel, midCalls);
    const perUser = routedTotal / dau;
    const perUserCNY = perUser * 7.2;

    let html = `
      <div style="text-align:center; margin-bottom:14px;">
        <div class="pu-sub">每用户每月 AI 成本 (路由优化后)</div>
        <span class="pu-big-num" style="color:var(--green);">&#165;${perUserCNY < 0.01 ? perUserCNY.toFixed(3) : perUserCNY.toFixed(2)}</span>
        <div class="pu-sub">$${perUser < 0.01 ? perUser.toFixed(4) : perUser.toFixed(3)} / user / month</div>
      </div>
      <div class="pu-model-grid">
    `;

    // Show all 3 models for comparison (no routing)
    MODELS.forEach(m => {
      const cost = calcCost(m, callsPerUser);
      const cny = cost * 7.2;
      const total = cost * dau;
      html += `
        <div class="pu-model-card" style="border-left:3px solid ${m.color};">
          <div class="pu-model-name">${m.name} (无路由)</div>
          <span class="pu-per-user" style="color:${m.color};">&#165;${cny < 0.1 ? cny.toFixed(3) : cny.toFixed(2)}</span>
          <div class="pu-monthly">/人/月 &middot; 总计 $${total < 1 ? total.toFixed(2) : Math.round(total).toLocaleString()}/月</div>
        </div>
      `;
    });

    html += `</div>
      <div style="text-align:center; margin-top:12px; padding-top:12px; border-top:1px dashed var(--border);">
        <span style="font-size:14px; color:var(--green); font-weight:600;">路由后总月成本: $${routedTotal < 1 ? routedTotal.toFixed(2) : Math.round(routedTotal).toLocaleString()} (&#165;${Math.round(routedTotal * 7.2).toLocaleString()})</span>
      </div>
    `;

    resultEl.innerHTML = html;
  }

  Object.values(s).forEach(el => { if (el) el.addEventListener('input', update); });
  update();
})();
