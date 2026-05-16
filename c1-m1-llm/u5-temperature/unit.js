/* ===========================================
   Unit 5 · Temperature — Distribution Shaper
   ===========================================
   Interactive probability distribution that
   reshapes with temperature slider + sampling.
*/

(() => {
  'use strict';

  // Raw logits for "今天天气真__" candidates
  const CANDIDATES = [
    { word: '好',  logit: 4.2 },
    { word: '棒',  logit: 2.8 },
    { word: '不',  logit: 1.5 },
    { word: '糟',  logit: 0.8 },
    { word: '闷',  logit: 0.3 },
    { word: '冷',  logit: 0.1 },
    { word: '热',  logit: -0.2 },
    { word: '奇',  logit: -1.0 },
    { word: '美',  logit: -1.5 },
    { word: '饿',  logit: -3.0 },
  ];

  const COLORS = [
    'var(--red)', 'var(--amber)', 'var(--blue)', 'var(--green)',
    'var(--purple)', 'var(--ink-muted)', 'var(--ink-muted)',
    'var(--ink-faint)', 'var(--ink-faint)', 'var(--ink-faint)'
  ];

  // Softmax with temperature
  function softmax(logits, temperature) {
    const t = Math.max(temperature, 0.01); // avoid div by 0
    const scaled = logits.map(l => l / t);
    const maxVal = Math.max(...scaled);
    const exps = scaled.map(s => Math.exp(s - maxVal));
    const sumExp = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sumExp);
  }

  // Weighted random sampling
  function sample(probs) {
    const r = Math.random();
    let cum = 0;
    for (let i = 0; i < probs.length; i++) {
      cum += probs[i];
      if (r <= cum) return i;
    }
    return probs.length - 1;
  }

  // DOM elements
  const slider = document.getElementById('dist-temp-slider');
  const tempVal = document.getElementById('dist-temp-val');
  const sampleBtn = document.getElementById('dist-sample-btn');
  const sampleResult = document.getElementById('dist-sample-result');
  const explainEl = document.getElementById('dist-explain');
  const chartEl = document.getElementById('dist-chart');

  if (!slider || !chartEl) return;

  // Build bar elements
  const logits = CANDIDATES.map(c => c.logit);
  const barWraps = [];

  CANDIDATES.forEach((c, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'dist-bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'dist-bar';
    bar.style.background = COLORS[i];

    const pct = document.createElement('div');
    pct.className = 'dist-bar-pct';

    const label = document.createElement('div');
    label.className = 'dist-bar-label';
    label.textContent = c.word;

    bar.appendChild(pct);
    wrap.appendChild(bar);
    wrap.appendChild(label);
    chartEl.appendChild(wrap);

    barWraps.push({ wrap, bar, pct, label });
  });

  function getExplanation(t) {
    if (t <= 0.05) return 'T≈0: 永远选 "好". 100 次问, 100 次同一个答案. 适合: 医疗建议、事实查询.';
    if (t <= 0.3) return 'T=0.1-0.3: 几乎总是 "好", 偶尔 "棒". 非常稳定. 适合: Vitamin 健康建议.';
    if (t <= 0.8) return 'T=0.7: 概率原样采样. "好" 最多, "棒" 偶尔, "不" 罕见. 自然中带变化. 默认值.';
    if (t <= 1.05) return 'T=1.0: 比默认更多样. 会出现一些意外组合. 适合: 日常对话、写作辅助.';
    if (t <= 1.3) return 'T=1.2: 概率被拉平. 低概率词获得更多机会. 适合: 创意写作、头脑风暴.';
    return 'T>1.3: 几乎随机. 任何词都可能出现. 输出不稳定. 不适合产品使用.';
  }

  function updateChart() {
    const t = parseFloat(slider.value) / 10;
    tempVal.textContent = t.toFixed(1);

    const probs = softmax(logits, t);

    barWraps.forEach((bw, i) => {
      const p = probs[i] * 100;
      bw.bar.style.height = Math.max(p * 1.8, 2) + '%'; // scale for visual
      bw.pct.textContent = p >= 1 ? p.toFixed(0) + '%' : p.toFixed(1) + '%';
    });

    explainEl.textContent = getExplanation(t);
  }

  function doSample() {
    const t = parseFloat(slider.value) / 10;
    const probs = softmax(logits, t);
    const idx = sample(probs);

    // Visual feedback
    barWraps.forEach((bw, i) => {
      bw.bar.classList.remove('sampled');
    });
    void barWraps[idx].bar.offsetWidth; // force reflow
    barWraps[idx].bar.classList.add('sampled');

    sampleResult.textContent = CANDIDATES[idx].word;
    sampleResult.style.animation = 'none';
    void sampleResult.offsetWidth;
    sampleResult.style.animation = '';
  }

  slider.addEventListener('input', updateChart);
  sampleBtn.addEventListener('click', doSample);

  // Initial render
  updateChart();

})();
