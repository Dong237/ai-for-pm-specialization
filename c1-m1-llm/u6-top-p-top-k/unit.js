/* ===========================================
   Unit 6 · Top-P / Top-K — Dual Threshold
   ===========================================
   Visualizes how Top-K and Top-P filter
   candidates from a probability distribution.
*/

(() => {
  'use strict';

  // Sorted candidates (descending by probability)
  const CANDIDATES = [
    { word: '好',  prob: 0.35 },
    { word: '棒',  prob: 0.18 },
    { word: '不',  prob: 0.12 },
    { word: '错',  prob: 0.08 },
    { word: '糟',  prob: 0.06 },
    { word: '冷',  prob: 0.05 },
    { word: '闷',  prob: 0.04 },
    { word: '热',  prob: 0.035 },
    { word: '美',  prob: 0.02 },
    { word: '奇',  prob: 0.015 },
    { word: '怪',  prob: 0.01 },
    { word: '香',  prob: 0.008 },
    { word: '甜',  prob: 0.005 },
    { word: '饿',  prob: 0.003 },
    { word: '紫',  prob: 0.001 },
  ];

  const COLORS = [
    'var(--red)', 'var(--amber)', 'var(--blue)', 'var(--green)',
    'var(--purple)', '#6bb1f0', '#4ade80', '#fbbf24',
    '#a78bfa', '#f87171', '#6bb1f0', '#4ade80',
    '#fbbf24', '#a78bfa', '#9a9aa8'
  ];

  // DOM
  const chartEl = document.getElementById('threshold-chart');
  const topkSlider = document.getElementById('topk-slider');
  const toppSlider = document.getElementById('topp-slider');
  const topkVal = document.getElementById('topk-val');
  const toppVal = document.getElementById('topp-val');
  const topkInfo = document.getElementById('topk-info');
  const toppInfo = document.getElementById('topp-info');
  const summaryEl = document.getElementById('threshold-summary');

  if (!chartEl) return;

  // Build bars
  const maxProb = CANDIDATES[0].prob;
  const barWraps = [];

  CANDIDATES.forEach((c, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'threshold-bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'threshold-bar kept';
    bar.style.background = COLORS[i % COLORS.length];
    bar.style.height = (c.prob / maxProb * 90) + '%';

    const pct = document.createElement('div');
    pct.className = 'threshold-bar-pct';
    pct.textContent = (c.prob * 100).toFixed(1) + '%';
    bar.appendChild(pct);

    const label = document.createElement('div');
    label.className = 'threshold-bar-label';
    label.textContent = c.word;

    wrap.appendChild(bar);
    wrap.appendChild(label);
    chartEl.appendChild(wrap);

    barWraps.push({ wrap, bar, pct, label });
  });

  function update() {
    const topK = parseInt(topkSlider.value);
    const topP = parseInt(toppSlider.value) / 100;

    topkVal.textContent = topK === 15 ? 'OFF' : topK;
    toppVal.textContent = topP >= 1.0 ? 'OFF' : topP.toFixed(2);

    // Determine which candidates pass both filters
    let cumProb = 0;
    let keptCount = 0;

    CANDIDATES.forEach((c, i) => {
      const passK = (topK >= 15) || (i < topK); // top K
      cumProb += c.prob;
      const passP = (topP >= 1.0) || (cumProb - c.prob < topP); // nucleus: include if cumProb before adding < P

      const kept = passK && passP;
      barWraps[i].bar.className = 'threshold-bar ' + (kept ? 'kept' : 'filtered');
      barWraps[i].wrap.className = 'threshold-bar-wrap' + (kept ? '' : ' filtered');

      if (kept) keptCount++;
    });

    // Info
    if (topK < 15) {
      topkInfo.textContent = `保留前 ${topK} 个候选`;
    } else {
      topkInfo.textContent = '不限制';
    }

    if (topP < 1.0) {
      toppInfo.textContent = `累计 ≤ ${(topP * 100).toFixed(0)}%`;
    } else {
      toppInfo.textContent = '不限制';
    }

    // Summary
    const totalKept = keptCount;
    const keptProb = CANDIDATES.slice(0, totalKept).reduce((s, c) => s + c.prob, 0);
    summaryEl.innerHTML = `<strong>${totalKept}</strong> 个候选通过筛选 (覆盖 ${(keptProb * 100).toFixed(0)}% 概率). ` +
      `<strong>${CANDIDATES.length - totalKept}</strong> 个被过滤掉 (灰色).` +
      (totalKept <= 3 ? ' <span style="color:var(--amber);">候选很少, 输出会很稳定.</span>' : '') +
      (totalKept >= 12 ? ' <span style="color:var(--red);">候选很多, 输出会很随机.</span>' : '');
  }

  topkSlider.addEventListener('input', update);
  toppSlider.addEventListener('input', update);

  // Initialize
  update();

})();
