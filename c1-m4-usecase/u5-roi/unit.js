/* ============================================
   U5 · ROI 评估框架 — ROI Calculator Widget
   ============================================ */
(() => {
  'use strict';

  // ---- Vitamin feature presets ----
  const presets = [
    { name: '自定义', timeSaved: 5, users: 5000, valuePerMin: 2, implCost: 50000 },
    { name: '健康知识 Q&A', timeSaved: 3, users: 8000, valuePerMin: 1.5, implCost: 30000 },
    { name: '每日身体总结', timeSaved: 5, users: 10000, valuePerMin: 2, implCost: 40000 },
    { name: '症状排查助手', timeSaved: 8, users: 4000, valuePerMin: 3, implCost: 80000 },
    { name: '个性化饮食建议', timeSaved: 4, users: 6000, valuePerMin: 2.5, implCost: 60000 },
    { name: '情绪陪伴对话', timeSaved: 10, users: 2000, valuePerMin: 1, implCost: 120000 },
    { name: '经期预测优化', timeSaved: 2, users: 12000, valuePerMin: 3, implCost: 45000 }
  ];

  // ---- DOM ----
  const select = document.getElementById('roi-preset');
  const sliderTime = document.getElementById('roi-time');
  const sliderUsers = document.getElementById('roi-users');
  const sliderValue = document.getElementById('roi-value');
  const sliderCost = document.getElementById('roi-cost');
  const valTime = document.getElementById('val-time');
  const valUsers = document.getElementById('val-users');
  const valValue = document.getElementById('val-value');
  const valCost = document.getElementById('val-cost');
  const resultMonthly = document.getElementById('result-monthly');
  const resultROI = document.getElementById('result-roi');
  const resultPayback = document.getElementById('result-payback');
  const resultVerdict = document.getElementById('result-verdict');
  const compareBtn = document.getElementById('roi-compare-btn');
  const compareChart = document.getElementById('roi-compare-chart');

  if (!select || !sliderTime) return;

  // ---- Format helpers ----
  function formatMoney(n) {
    if (n >= 10000) return '¥' + (n / 10000).toFixed(1) + '万';
    return '¥' + n.toLocaleString();
  }

  function formatUsers(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return n.toLocaleString();
  }

  // ---- Calculate ROI ----
  function calculate() {
    const timeSaved = parseFloat(sliderTime.value);
    const users = parseFloat(sliderUsers.value);
    const valuePerMin = parseFloat(sliderValue.value);
    const implCost = parseFloat(sliderCost.value);

    const monthlyValue = timeSaved * users * valuePerMin;
    const roi = monthlyValue > 0 ? (monthlyValue * 12) / implCost : 0;
    const payback = monthlyValue > 0 ? implCost / monthlyValue : Infinity;

    // Update displays
    valTime.textContent = timeSaved + ' min';
    valUsers.textContent = formatUsers(users);
    valValue.textContent = '¥' + valuePerMin.toFixed(1);
    valCost.textContent = formatMoney(implCost);

    resultMonthly.textContent = formatMoney(Math.round(monthlyValue));
    resultROI.textContent = roi.toFixed(1) + 'x';
    resultPayback.textContent = payback === Infinity ? '---' : payback.toFixed(1) + ' 个月';

    // Color code ROI
    if (roi >= 3) {
      resultROI.style.color = 'var(--green)';
    } else if (roi >= 1) {
      resultROI.style.color = 'var(--amber)';
    } else {
      resultROI.style.color = 'var(--red)';
    }

    // Verdict
    if (roi >= 3) {
      resultVerdict.className = 'roi-verdict verdict-green';
      resultVerdict.textContent = 'GO! ROI > 3x';
    } else if (roi >= 1) {
      resultVerdict.className = 'roi-verdict verdict-amber';
      resultVerdict.textContent = 'MAYBE — 需要更多论证';
    } else {
      resultVerdict.className = 'roi-verdict verdict-red';
      resultVerdict.textContent = 'NO — ROI < 1x, 不值得';
    }

    // Sensitivity: find which variable has biggest impact
    highlightDominant(timeSaved, users, valuePerMin, implCost);
  }

  // ---- Sensitivity highlighting ----
  function highlightDominant(time, users, value, cost) {
    // Calculate partial derivatives (impact of 10% increase)
    const base = time * users * value * 12 / cost;
    const impacts = [
      { el: valTime, impact: Math.abs((time * 1.1 * users * value * 12 / cost) - base) },
      { el: valUsers, impact: Math.abs((time * users * 1.1 * value * 12 / cost) - base) },
      { el: valValue, impact: Math.abs((time * users * value * 1.1 * 12 / cost) - base) },
      { el: valCost, impact: Math.abs((time * users * value * 12 / (cost * 1.1)) - base) }
    ];

    const maxImpact = Math.max(...impacts.map(i => i.impact));
    impacts.forEach(item => {
      if (item.impact === maxImpact && maxImpact > 0) {
        item.el.classList.add('dominant');
      } else {
        item.el.classList.remove('dominant');
      }
    });
  }

  // ---- Preset change ----
  select.addEventListener('change', () => {
    const idx = parseInt(select.value);
    const p = presets[idx];
    sliderTime.value = p.timeSaved;
    sliderUsers.value = p.users;
    sliderValue.value = p.valuePerMin;
    sliderCost.value = p.implCost;
    calculate();
  });

  // ---- Slider listeners ----
  [sliderTime, sliderUsers, sliderValue, sliderCost].forEach(s => {
    s.addEventListener('input', () => {
      select.value = '0'; // switch to custom
      calculate();
    });
  });

  // ---- Compare All ----
  if (compareBtn && compareChart) {
    compareBtn.addEventListener('click', () => {
      compareChart.classList.toggle('visible');
      if (compareChart.classList.contains('visible')) {
        renderCompareChart();
        compareBtn.textContent = '收起对比 ↑';
      } else {
        compareBtn.textContent = '对比所有功能 →';
      }
    });
  }

  function renderCompareChart() {
    let html = '';
    // Skip first (custom)
    const features = presets.slice(1);
    const rois = features.map(f => {
      const monthly = f.timeSaved * f.users * f.valuePerMin;
      return (monthly * 12) / f.implCost;
    });
    const maxRoi = Math.max(...rois);

    features.forEach((f, i) => {
      const roi = rois[i];
      const pct = (roi / maxRoi) * 100;
      let colorClass = 'roi-green';
      let barColor = 'var(--green)';
      if (roi < 1) { colorClass = 'roi-red'; barColor = 'var(--red)'; }
      else if (roi < 3) { colorClass = 'roi-amber'; barColor = 'var(--amber)'; }

      html += `
        <div class="feature-bar-row">
          <div class="feature-bar-name">${f.name}</div>
          <div class="feature-bar-track">
            <div class="feature-bar-fill" style="width:${pct}%;background:${barColor}">${roi.toFixed(1)}x</div>
          </div>
          <div class="feature-bar-roi ${colorClass}">${roi.toFixed(1)}x</div>
        </div>`;
    });

    compareChart.innerHTML = html;

    // Animate bars
    requestAnimationFrame(() => {
      compareChart.querySelectorAll('.feature-bar-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => { bar.style.width = w; });
      });
    });
  }

  // ---- ROI formula animation ----
  const formulaBlocks = document.querySelectorAll('.roi-block');
  if (formulaBlocks.length) {
    const formulaObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const blocks = e.target.querySelectorAll('.roi-block');
          blocks.forEach((block, i) => {
            setTimeout(() => block.classList.add('visible'), i * 300);
          });
          formulaObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    const formulaContainer = document.querySelector('.roi-formula');
    if (formulaContainer) formulaObserver.observe(formulaContainer);
  }

  // ---- Sensitivity bars animation ----
  const sensBars = document.querySelectorAll('.sens-bar-fill');
  if (sensBars.length) {
    const sensObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const bar = e.target;
          bar.style.width = bar.dataset.width;
          sensObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    sensBars.forEach(b => {
      b.dataset.width = b.style.width;
      b.style.width = '0';
      sensObserver.observe(b);
    });
  }

  // ---- Init ----
  select.value = '1';
  const p = presets[1];
  sliderTime.value = p.timeSaved;
  sliderUsers.value = p.users;
  sliderValue.value = p.valuePerMin;
  sliderCost.value = p.implCost;
  calculate();

})();
