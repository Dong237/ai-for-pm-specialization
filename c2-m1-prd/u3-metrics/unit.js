/* U3 — Metrics Dashboard Widget */
(() => {
  'use strict';

  // ---- Metric thresholds ----
  const metrics = {
    accuracy: { target: 90, min: 80, label: '准确率', unit: '%' },
    acceptance: { target: 85, min: 70, label: '接受率', unit: '%' },
    refusal: { target: 5, max: 15, label: '拒答率', unit: '%', inverted: true },
    latency: { target: 2.0, max: 5.0, label: 'P95 延迟', unit: 's', inverted: true },
  };

  // ---- DOM refs ----
  const sliders = {};
  const cards = {};
  const bars = {};
  const values = {};

  Object.keys(metrics).forEach(key => {
    sliders[key] = document.getElementById(`slider-${key}`);
    cards[key] = document.getElementById(`card-${key}`);
    bars[key] = document.getElementById(`bar-${key}`);
    values[key] = document.getElementById(`val-${key}`);
  });

  const statusEl = document.getElementById('dash-status');

  function updateDashboard() {
    let allGood = true;
    let anyAlert = false;

    Object.keys(metrics).forEach(key => {
      const slider = sliders[key];
      if (!slider) return;

      const m = metrics[key];
      const val = parseFloat(slider.value);
      const card = cards[key];
      const bar = bars[key];
      const valEl = values[key];

      if (valEl) valEl.textContent = m.inverted ? val.toFixed(1) : Math.round(val);

      // Determine status
      let status = 'good';
      if (m.inverted) {
        if (val > m.max) { status = 'alert'; anyAlert = true; allGood = false; }
        else if (val > m.target) { status = 'warn'; allGood = false; }
      } else {
        if (val < m.min) { status = 'alert'; anyAlert = true; allGood = false; }
        else if (val < m.target) { status = 'warn'; allGood = false; }
      }

      if (card) {
        card.className = 'metric-card ' + status;
      }

      if (bar) {
        let pct;
        if (m.inverted) {
          pct = Math.max(0, Math.min(100, ((m.max - val) / m.max) * 100));
        } else {
          pct = Math.max(0, Math.min(100, val));
        }
        bar.style.width = pct + '%';
        bar.style.background = status === 'good' ? 'var(--green)' : status === 'warn' ? 'var(--amber)' : 'var(--red)';
      }
    });

    if (statusEl) {
      if (allGood) {
        statusEl.className = 'dash-status pass';
        statusEl.textContent = '&#10004; 所有指标达标 — 可以上线';
      } else if (anyAlert) {
        statusEl.className = 'dash-status fail';
        statusEl.textContent = '&#10006; 有指标严重不达标 — 需要启动兜底或回退';
      } else {
        statusEl.className = 'dash-status warn-status';
        statusEl.textContent = '&#9888; 部分指标在警戒区 — 需要关注和优化';
      }
      // Fix HTML entity rendering
      statusEl.innerHTML = statusEl.textContent;
    }
  }

  // ---- Bind sliders ----
  Object.keys(metrics).forEach(key => {
    if (sliders[key]) {
      sliders[key].addEventListener('input', updateDashboard);
    }
  });

  // ---- Initial render ----
  updateDashboard();

})();
