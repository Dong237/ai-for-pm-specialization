/* U7: Salary Negotiation — Offer Comparator Widget */
(() => {
  'use strict';

  const compEl = document.getElementById('offer-comparator');
  if (!compEl) return;

  const STORAGE_KEY = 'u7-offers';

  const fields = [
    { key: 'name', label: '公司名', type: 'text', default: ['公司 A', '公司 B', '公司 C'] },
    { key: 'base', label: '月薪 (万)', type: 'number', default: [3, 3.5, 2.8] },
    { key: 'bonus', label: '年终奖 (月数)', type: 'number', default: [3, 2, 4] },
    { key: 'equity', label: '股权/期权 (万/年)', type: 'number', default: [0, 5, 10] },
    { key: 'teamSize', label: '团队规模', type: 'number', default: [50, 15, 8] },
    { key: 'stage', label: '产品阶段', type: 'select', options: ['探索期', '增长期', '成熟期'], default: ['成熟期', '增长期', '探索期'] },
    { key: 'growth', label: '成长潜力 (1-10)', type: 'number', default: [5, 8, 9] }
  ];

  const weightDefs = [
    { key: 'salary', label: '薪资', default: 30 },
    { key: 'equity', label: '股权', default: 20 },
    { key: 'team', label: '团队', default: 15 },
    { key: 'stage', label: '阶段', default: 15 },
    { key: 'growth', label: '成长', default: 20 }
  ];

  let offers = [{}, {}, {}];
  let weights = {};

  // Load state
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      if (saved.offers) offers = saved.offers;
      if (saved.weights) weights = saved.weights;
    }
  } catch (e) {}

  // Initialize defaults
  fields.forEach(f => {
    for (let i = 0; i < 3; i++) {
      if (offers[i][f.key] === undefined) offers[i][f.key] = f.default[i];
    }
  });
  weightDefs.forEach(w => {
    if (weights[w.key] === undefined) weights[w.key] = w.default;
  });

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ offers, weights }));
  }

  function calculateScore(offer) {
    const totalWeight = weightDefs.reduce((s, w) => s + (weights[w.key] || 0), 0) || 1;

    // Normalize each dimension to 0-100
    const baseSalary = ((offer.base || 0) * 12 + (offer.base || 0) * (offer.bonus || 0));
    const salaryScore = Math.min(100, (baseSalary / 80) * 100);
    const equityScore = Math.min(100, ((offer.equity || 0) / 15) * 100);
    const teamScore = Math.min(100, ((offer.teamSize || 1) / 50) * 60 + 40);
    const stageMap = { '探索期': 90, '增长期': 70, '成熟期': 50 };
    const stageScore = stageMap[offer.stage] || 50;
    const growthScore = ((offer.growth || 5) / 10) * 100;

    const score = (
      salaryScore * (weights.salary / totalWeight) +
      equityScore * (weights.equity / totalWeight) +
      teamScore * (weights.team / totalWeight) +
      stageScore * (weights.stage / totalWeight) +
      growthScore * (weights.growth / totalWeight)
    );

    return Math.round(score);
  }

  function render() {
    // Build offer input columns
    const inputsEl = compEl.querySelector('.offer-inputs');
    inputsEl.innerHTML = '';

    for (let i = 0; i < 3; i++) {
      const col = document.createElement('div');
      col.className = 'offer-column';
      let fieldsHTML = '';
      fields.forEach(f => {
        const val = offers[i][f.key] !== undefined ? offers[i][f.key] : '';
        if (f.type === 'select') {
          const optionsHTML = f.options.map(o =>
            `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`
          ).join('');
          fieldsHTML += `<div class="offer-field"><label>${f.label}</label><select data-offer="${i}" data-key="${f.key}">${optionsHTML}</select></div>`;
        } else {
          fieldsHTML += `<div class="offer-field"><label>${f.label}</label><input type="${f.type}" data-offer="${i}" data-key="${f.key}" value="${val}" /></div>`;
        }
      });
      col.innerHTML = `<div class="offer-column-title">${offers[i].name || 'Offer ' + (i + 1)}</div>${fieldsHTML}`;
      inputsEl.appendChild(col);
    }

    // Event listeners for inputs
    compEl.querySelectorAll('.offer-field input, .offer-field select').forEach(el => {
      el.addEventListener('input', () => {
        const idx = parseInt(el.dataset.offer);
        const key = el.dataset.key;
        offers[idx][key] = el.type === 'number' ? parseFloat(el.value) || 0 : el.value;
        save();
        updateResults();
        // Update column title if name changed
        if (key === 'name') {
          el.closest('.offer-column').querySelector('.offer-column-title').textContent = el.value || 'Offer ' + (idx + 1);
        }
      });
    });

    // Weights
    const weightsEl = compEl.querySelector('.weights-section');
    weightsEl.innerHTML = '<h4>调整权重 (拖动滑块)</h4>';
    weightDefs.forEach(w => {
      const row = document.createElement('div');
      row.className = 'weight-row';
      row.innerHTML = `
        <span class="weight-label">${w.label}</span>
        <input type="range" min="0" max="50" value="${weights[w.key]}" data-wkey="${w.key}" />
        <span class="weight-value">${weights[w.key]}%</span>
      `;
      row.querySelector('input').addEventListener('input', (e) => {
        weights[w.key] = parseInt(e.target.value);
        row.querySelector('.weight-value').textContent = weights[w.key] + '%';
        save();
        updateResults();
      });
      weightsEl.appendChild(row);
    });

    updateResults();
  }

  function updateResults() {
    const resultsEl = compEl.querySelector('.offer-results');
    const winnerEl = compEl.querySelector('.offer-winner');

    const scores = offers.map((o, i) => ({ idx: i, name: o.name || 'Offer ' + (i + 1), score: calculateScore(o) }));

    resultsEl.innerHTML = '';
    scores.forEach(s => {
      const bar = document.createElement('div');
      bar.className = 'offer-score-bar';
      bar.innerHTML = `
        <div class="offer-score-name">${s.name}</div>
        <div class="offer-score-track">
          <div class="offer-score-fill" style="width:${s.score}%">${s.score}</div>
        </div>
      `;
      resultsEl.appendChild(bar);
    });

    const best = scores.reduce((a, b) => a.score > b.score ? a : b);
    winnerEl.textContent = '推荐: ' + best.name + ' (综合得分 ' + best.score + ')';
  }

  render();
})();
