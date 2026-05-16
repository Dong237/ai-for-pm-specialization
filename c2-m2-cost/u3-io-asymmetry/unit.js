/* ===========================================
   Unit 3 · Input vs Output 价格不对称 — IO Visualizer
   =========================================== */
(() => {
  'use strict';

  const MODELS = [
    { name: 'DS V4 Flash', input: 0.14, output: 0.28, color: '#4a9eed' },
    { name: 'Qwen3 Max', input: 0.78, output: 3.12, color: '#8b5cf6' },
    { name: 'GPT-5.4', input: 2.50, output: 15.00, color: '#22c55e' },
    { name: 'Claude Sonnet', input: 3.00, output: 15.00, color: '#f59e0b' },
    { name: 'GPT-5.5', input: 5.00, output: 30.00, color: '#ef4444' },
  ];

  const inSlider = document.getElementById('io-in-slider');
  const outSlider = document.getElementById('io-out-slider');
  const inVal = document.getElementById('io-in-val');
  const outVal = document.getElementById('io-out-val');
  const resultGrid = document.getElementById('io-result-grid');

  function update() {
    if (!inSlider || !outSlider || !resultGrid) return;
    const inTokens = parseInt(inSlider.value);
    const outTokens = parseInt(outSlider.value);
    inVal.textContent = inTokens;
    outVal.textContent = outTokens;

    resultGrid.innerHTML = MODELS.map(m => {
      const inCost = (inTokens / 1_000_000) * m.input;
      const outCost = (outTokens / 1_000_000) * m.output;
      const total = inCost + outCost;
      const outPct = total > 0 ? Math.round((outCost / total) * 100) : 0;
      const fmt = total < 0.001 ? '$' + total.toFixed(5) : '$' + total.toFixed(4);

      return `
        <div class="io-result-card" style="border-left:3px solid ${m.color};">
          <div class="io-result-model">${m.name}</div>
          <span class="io-result-cost" style="color:${m.color};">${fmt}</span>
          <div class="io-result-breakdown">
            输入 $${inCost.toFixed(5)} + 输出 $${outCost.toFixed(5)}<br/>
            <strong>输出占 ${outPct}%</strong>
          </div>
        </div>
      `;
    }).join('');
  }

  if (inSlider && outSlider) {
    inSlider.addEventListener('input', update);
    outSlider.addEventListener('input', update);
    update();
  }

  // Animate IO bars
  const ioBars = document.querySelectorAll('.io-bar');
  if (ioBars.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.w;
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    ioBars.forEach(b => {
      b.dataset.w = b.style.width;
      b.style.width = '0px';
      observer.observe(b);
    });
  }
})();
