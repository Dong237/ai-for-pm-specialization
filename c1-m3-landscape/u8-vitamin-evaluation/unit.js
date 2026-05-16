/* ===========================================
   Unit 8 · Vitamin 5 模型横评
   — Model Evaluation Board: 5×6 grid with star ratings
   ===========================================
   Interactive 5-model × 6-dimension scoring grid.
   Users click stars (1-5) per cell.
   Pre-loaded with suggested ratings on "reveal" button.
   Shows weighted total score per model + highlights winner.
*/

(() => {
  'use strict';

  // ---- Config ----
  const MODELS = [
    { id: 'deepseek', name: 'DeepSeek V4 Flash' },
    { id: 'qwen', name: 'Qwen3.5-Plus' },
    { id: 'kimi', name: 'Kimi K2.6' },
    { id: 'haiku', name: 'Claude Haiku 4.5' },
    { id: 'doubao', name: 'Doubao-Seed-2.0' }
  ];

  const DIMENSIONS = [
    { id: 'cost', name: '成本', weight: 0.25 },
    { id: 'chinese', name: '中文质量', weight: 0.30 },
    { id: 'context', name: 'Context', weight: 0.05 },
    { id: 'speed', name: '速度', weight: 0.20 },
    { id: 'multimodal', name: '多模态', weight: 0.08 },
    { id: 'reasoning', name: '推理深度', weight: 0.12 }
  ];

  // Suggested ratings (1-5 stars)
  const SUGGESTED = {
    deepseek:  { cost: 5, chinese: 4, context: 3, speed: 5, multimodal: 3, reasoning: 3 },
    qwen:      { cost: 5, chinese: 5, context: 4, speed: 5, multimodal: 4, reasoning: 4 },
    kimi:      { cost: 3, chinese: 4, context: 3, speed: 3, multimodal: 3, reasoning: 5 },
    haiku:     { cost: 2, chinese: 3, context: 4, speed: 4, multimodal: 4, reasoning: 4 },
    doubao:    { cost: 2, chinese: 5, context: 5, speed: 4, multimodal: 5, reasoning: 4 }
  };

  // ---- State ----
  // ratings[modelId][dimId] = 0-5 (0 = not rated)
  const ratings = {};
  MODELS.forEach(m => {
    ratings[m.id] = {};
    DIMENSIONS.forEach(d => {
      ratings[m.id][d.id] = 0;
    });
  });

  // ---- DOM ----
  const board = document.getElementById('eval-board');
  const result = document.getElementById('eval-result');
  const btnReveal = document.getElementById('btn-reveal');
  const btnReset = document.getElementById('btn-reset');

  if (!board) return;

  // ---- Build table ----
  function buildTable() {
    const table = document.createElement('table');
    table.className = 'eval-table';

    // Header row
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const thModel = document.createElement('th');
    thModel.textContent = '模型';
    headRow.appendChild(thModel);

    DIMENSIONS.forEach(d => {
      const th = document.createElement('th');
      th.innerHTML = d.name + '<br><span style="font-size:10px;color:var(--ink-faint);">' + (d.weight * 100) + '%</span>';
      headRow.appendChild(th);
    });

    const thTotal = document.createElement('th');
    thTotal.textContent = '加权总分';
    thTotal.className = 'total-col';
    headRow.appendChild(thTotal);

    thead.appendChild(headRow);
    table.appendChild(thead);

    // Body rows
    const tbody = document.createElement('tbody');
    MODELS.forEach(model => {
      const tr = document.createElement('tr');
      tr.dataset.model = model.id;

      const tdName = document.createElement('td');
      tdName.textContent = model.name;
      tr.appendChild(tdName);

      DIMENSIONS.forEach(dim => {
        const td = document.createElement('td');
        const starGroup = document.createElement('div');
        starGroup.className = 'star-group';
        starGroup.dataset.model = model.id;
        starGroup.dataset.dim = dim.id;

        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('span');
          star.className = 'star';
          star.dataset.value = i;
          star.textContent = '\u2605'; // filled star character
          star.addEventListener('click', () => setRating(model.id, dim.id, i));
          starGroup.appendChild(star);
        }

        td.appendChild(starGroup);
        tr.appendChild(td);
      });

      const tdTotal = document.createElement('td');
      tdTotal.className = 'total-col';
      tdTotal.dataset.totalFor = model.id;
      tdTotal.textContent = '—';
      tr.appendChild(tdTotal);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    board.innerHTML = '';
    board.appendChild(table);
  }

  // ---- Set rating ----
  function setRating(modelId, dimId, value) {
    ratings[modelId][dimId] = value;
    updateStars(modelId, dimId);
    updateTotals();
  }

  // ---- Update star display ----
  function updateStars(modelId, dimId) {
    const group = board.querySelector(
      '.star-group[data-model="' + modelId + '"][data-dim="' + dimId + '"]'
    );
    if (!group) return;

    const val = ratings[modelId][dimId];
    const stars = group.querySelectorAll('.star');
    stars.forEach((star, idx) => {
      star.classList.toggle('filled', idx < val);
    });
  }

  // ---- Update all stars ----
  function updateAllStars() {
    MODELS.forEach(m => {
      DIMENSIONS.forEach(d => {
        updateStars(m.id, d.id);
      });
    });
  }

  // ---- Calculate weighted total ----
  function calcTotal(modelId) {
    let total = 0;
    let allRated = true;
    DIMENSIONS.forEach(d => {
      const r = ratings[modelId][d.id];
      if (r === 0) allRated = false;
      total += r * d.weight;
    });
    return allRated ? total : null;
  }

  // ---- Update totals ----
  function updateTotals() {
    let bestModel = null;
    let bestScore = -1;
    let allComplete = true;

    MODELS.forEach(m => {
      const total = calcTotal(m.id);
      const td = board.querySelector('[data-total-for="' + m.id + '"]');
      if (!td) return;

      if (total === null) {
        td.textContent = '—';
        allComplete = false;
      } else {
        td.textContent = total.toFixed(2);
        if (total > bestScore) {
          bestScore = total;
          bestModel = m;
        }
      }

      // Remove winner highlight
      const tr = td.parentElement;
      tr.classList.remove('winner-row');
    });

    // Highlight winner
    if (allComplete && bestModel) {
      const winnerRow = board.querySelector('tr[data-model="' + bestModel.id + '"]');
      if (winnerRow) winnerRow.classList.add('winner-row');

      // Show result
      result.classList.add('visible');
      result.innerHTML = '<div class="eval-winner-title">🏆 推荐: ' + bestModel.name + '</div>' +
        '<div class="eval-winner-score">加权总分: ' + bestScore.toFixed(2) + ' / 5.00</div>';
    } else {
      result.classList.remove('visible');
    }
  }

  // ---- Reveal suggested ratings ----
  if (btnReveal) {
    btnReveal.addEventListener('click', () => {
      MODELS.forEach(m => {
        DIMENSIONS.forEach(d => {
          ratings[m.id][d.id] = SUGGESTED[m.id][d.id];
        });
      });
      updateAllStars();
      updateTotals();
    });
  }

  // ---- Reset ----
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      MODELS.forEach(m => {
        DIMENSIONS.forEach(d => {
          ratings[m.id][d.id] = 0;
        });
      });
      updateAllStars();
      updateTotals();
    });
  }

  // ---- Initialize ----
  buildTable();

})();
