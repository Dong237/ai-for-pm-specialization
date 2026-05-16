/* ===========================================
   Unit 4 · Prompt Caching — Cache Hit Simulator
   =========================================== */
(() => {
  'use strict';

  const sysArea = document.getElementById('cache-system');
  const userArea = document.getElementById('cache-user');
  const resultsEl = document.getElementById('cache-results');

  const MODELS = [
    { name: 'DeepSeek V4 Flash', inputFull: 0.14, inputCached: 0.0028, output: 0.28 },
    { name: 'Claude Sonnet 4.6', inputFull: 3.00, inputCached: 0.30, output: 15.00 },
    { name: 'GPT-5.4', inputFull: 2.50, inputCached: 0.25, output: 15.00 },
  ];

  function countTokens(text) {
    let count = 0;
    for (const ch of text) {
      if (/[\u4e00-\u9fff]/.test(ch)) count += 1.2;
      else if (/[a-zA-Z]/.test(ch)) count += 0.3;
      else if (/\s/.test(ch)) count += 0.1;
      else count += 0.5;
    }
    return Math.max(0, Math.round(count));
  }

  function update() {
    if (!sysArea || !userArea || !resultsEl) return;
    const sysTok = countTokens(sysArea.value);
    const userTok = countTokens(userArea.value);
    const totalIn = sysTok + userTok;
    const cacheRate = totalIn > 0 ? Math.round((sysTok / totalIn) * 100) : 0;

    let html = `
      <div class="cache-meter">
        <div class="cache-meter-label">
          <span>缓存命中率</span>
          <span style="font-weight:700; color:var(--green);">${cacheRate}%</span>
        </div>
        <div class="cache-meter-bar">
          <div class="meter-cached" style="width:${cacheRate}%;">${sysTok} cached</div>
          <div class="meter-miss" style="width:${100 - cacheRate}%;">${userTok} miss</div>
        </div>
      </div>
      <div class="cache-savings-grid">
    `;

    MODELS.forEach(m => {
      const fullCost = (totalIn / 1_000_000) * m.inputFull;
      const cachedCost = (sysTok / 1_000_000) * m.inputCached + (userTok / 1_000_000) * m.inputFull;
      const savings = fullCost > 0 ? Math.round((1 - cachedCost / fullCost) * 100) : 0;
      const savingsColor = savings > 80 ? 'var(--green)' : savings > 50 ? 'var(--amber)' : 'var(--red)';

      html += `
        <div class="cache-saving-card">
          <div class="cache-saving-label">${m.name}</div>
          <span class="cache-saving-val" style="color:${savingsColor};">-${savings}%</span>
          <div class="cache-saving-label">
            $${fullCost.toFixed(6)} &rarr; $${cachedCost.toFixed(6)}
          </div>
        </div>
      `;
    });

    html += '</div>';
    resultsEl.innerHTML = html;
  }

  if (sysArea && userArea) {
    sysArea.addEventListener('input', update);
    userArea.addEventListener('input', update);
    update();
  }
})();
